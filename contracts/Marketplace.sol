pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace is Ownable {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockedAmount;

    SellOrder[] public sellOrders;
    BuyOrder[] public buyOrders;

    struct SellOrder {
        uint256 proposalId;
        uint256 tokenId;
        uint256 initPrice;
        address nftOwner;
        address tokenAddress;
        bool isForSale;
    }

    struct BuyOrder {
        uint256 buyOrderId;
        uint256 sellOrderId;
        uint256 proposedPrice;
        address buyer;
        bool isRejected;
    }

    event SellOrderCreated(
        address indexed seller,
        address indexed tokenAddress,
        uint256 indexed tokenId,
        uint256 initPrice,
        uint256 orderId
    );

    event BuyOrderCreated(
        address indexed buyer,
        uint256 indexed sellOrderId,
        uint256 proposedPrice,
        uint256 buyOrderId
    );

    constructor() Ownable(msg.sender) {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function lockAmount(address _addressToLock, uint256 _amount) internal {
        lockedAmount[_addressToLock] += _amount;
    }

    function unlockAmount(address _addressToLock, uint256 _amount) internal {
        lockedAmount[_addressToLock] -= _amount;
    }

    function createSellOrder(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _initPrice
    ) external {
        uint256 sellOrderId = sellOrders.length;

        SellOrder memory newSellOrder = SellOrder(
            sellOrderId,
            _tokenId,
            _initPrice,
            msg.sender,
            _tokenAddress,
            true
        );

        sellOrders.push(newSellOrder);

        emit SellOrderCreated(
            msg.sender,
            _tokenAddress,
            _tokenId,
            _initPrice,
            sellOrderId
        );
    }

    function createBuyOrder(
        uint256 _sellOrderId,
        uint256 _proposedPrice
    ) external payable {
        require(
            sellOrders[_sellOrderId].isForSale == true,
            "This NFT has already sold or removed from selling."
        );
        require(
            balances[msg.sender] - lockedAmount[msg.sender] >= _proposedPrice,
            "Amount of your free balance is below than proposed price"
        );

        lockAmount(msg.sender, _proposedPrice);

        uint256 buyOrderId = buyOrders.length;

        BuyOrder memory newBuyOrder = BuyOrder(
            buyOrderId,
            _sellOrderId,
            _proposedPrice,
            msg.sender,
            false
        );

        buyOrders.push(newBuyOrder);

        emit BuyOrderCreated(
            msg.sender,
            _sellOrderId,
            _proposedPrice,
            buyOrderId
        );
    }

    function acceptBuyOrder() external {}
}
