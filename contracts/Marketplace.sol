pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Marketplace is Ownable {
    mapping(address => uint256) public balances;
    mapping(address => uint256) public lockedAmount;

    SellItem[] public sellItems;
    BuyOrder[] public buyOrders;

    struct SellItem {
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
        bool isClosed;
    }

    event SellItemCreated(
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

    event Buy(
        address indexed buyer,
        address indexed tokenAddress,
        uint256 indexed tokenId,
        uint256 orderPrice
    );

    event Sell(
        address indexed seller,
        address indexed tokenAddress,
        uint256 indexed tokenId,
        uint256 orderPrice
    );

    event BuyOrderAccepted{
        uint256 indexed buyOrderId;
    }

    event BuyOrderRejected{
        uint256 indexed buyOrderId;
    }

    event BuyOrderRetracted{
        uint256 indexed buyOrderId;
    }

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

    function createSellItem(
        address _tokenAddress,
        uint256 _tokenId,
        uint256 _initPrice
    ) external {
        uint256 sellItemId = sellItems.length;

        SellItem memory newSellItem = SellItem(
            sellItemId,
            _tokenId,
            _initPrice,
            msg.sender,
            _tokenAddress,
            true
        );

        sellItems.push(newSellItem);

        emit SellItemCreated(
            msg.sender,
            _tokenAddress,
            _tokenId,
            _initPrice,
            sellItemId
        );
    }

    function createBuyOrder(
        uint256 _sellOrderId,
        uint256 _proposedPrice
    ) external payable {
        require(
            sellItems[_sellOrderId].isForSale == true,
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
            false,
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

    function acceptBuyOrder(uint256 _buyOrderId) external {
        BuyOrder memory acceptedBuyOrder = buyOrders[_buyOrderId];
        SellItem memory sellItem = sellItems[acceptedBuyOrder.sellOrderId];

        require(
            sellItem.nftOwner == msg.sender,
            "This sell order is not yours!"
        );

        require(!acceptedBuyOrder.isClosed, "Outdated buy order");

        require(sellItem.isForSale, "Already sold!");

        ERC721(sellItem.tokenAddress).safeTransferFrom(
            msg.sender,
            acceptedBuyOrder.buyer,
            sellItem.tokenId
        );

        buyOrders[_buyOrderId].isClosed = true;
        sellItems[acceptedBuyOrder.sellOrderId].isForSale = false;

        payable(msg.sender).transfer(acceptedBuyOrder.proposedPrice);

        unlockAmount(acceptedBuyOrder.buyer, acceptedBuyOrder.proposedPrice);

        emit Buy(
            acceptedBuyOrder.buyer,
            sellItem.tokenAddress,
            sellItem.tokenId,
            acceptedBuyOrder.proposedPrice
        );

        emit Sell(
            sellItem.nftOwner,
            sellItem.tokenAddress,
            sellItem.tokenId,
            acceptedBuyOrder.proposedPrice
        );

        emit BuyOrderAccepted(_buyOrderId);
    }

    function rejectBuyOrder(uint256 _buyOrderId) external {
        BuyOrder memory buyOrder = buyOrders[_buyOrderId];
        SellItem memory sellItem = sellItems[buyOrder.sellOrderId];

        require(
            sellItem.nftOwner == msg.sender,
            "This sell order is not yours!"
        );

        require(!buyOrder.isRejected, "Buy order has already rejected.");

        require(!buyOrder.isClosed, "Buy order has already closed.");

        require(sellItem.isForSale, "Already sold, no reason to reject order.");

        unlockAmount(buyOrder.buyer, buyOrder.proposedPrice);

        buyOrders[_buyOrderId].isClosed = true;
        buyOrders[_buyOrderId].isRejected = true;

        emit BuyOrderRejected(_buyOrderId);
    }

    function retractBuyOrder(uint256 _buyOrderId) external {
        BuyOrder memory buyOrder = buyOrders[_buyOrderId];

        require(buyOrder.buyer == msg.sender, "It is not yours buy order!");

        require(!buyOrder.isClosed, "Buy order has already closed!");

        require(!buyOrder.isRejected, "Buy order has already rejected!");

        unlockAmount(buyOrder.buyer, buyOrder.proposedPrice);

        buyOrders[_buyOrderId].isClosed = true;

        emit BuyOrderRetracted(_buyOrderId);
    }
}
