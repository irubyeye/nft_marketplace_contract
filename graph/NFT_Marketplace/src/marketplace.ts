import {
  Marketplace,
  Buy,
  BuyOrderAccepted,
  BuyOrderCreated,
  BuyOrderRejected,
  BuyOrderRetracted,
  OwnershipTransferred,
  Sell,
  SellItemCreated,
  SellItemRetracted,
} from "../generated/Marketplace/Marketplace";
import { Nft } from "../generated/Marketplace/Nft";
import { SellItem, BuyOrder, Selling, Buying } from "../generated/schema";

export function handleBuy(event: Buy): void {
  let entity = Buying.load(event.params.buyer.toString());

  if (!entity) {
    entity = new Buying(event.params.buyer.toString());
    entity.boughtItems = [event.params.sellItemId.toString()];
  } else {
    entity.boughtItems.push(event.params.sellItemId.toString());
  }

  entity.orderPrice = event.params.orderPrice;

  let boughtItem = SellItem.load(event.params.sellItemId.toString());

  if (boughtItem) {
    boughtItem.isForSale = false;
    boughtItem.save();
  }

  entity.save();
}

export function handleBuyOrderAccepted(event: BuyOrderAccepted): void {}

export function handleBuyOrderCreated(event: BuyOrderCreated): void {
  let entity = new BuyOrder(event.params.buyOrderId.toString());

  entity.sellOrderId = event.params.sellOrderId;
  entity.proposedPrice = event.params.proposedPrice;
  entity.buyer = event.params.buyer;
  entity.sellItem = event.params.sellOrderId.toString();
  entity.isClosed = false;
  entity.isRejected = false;

  entity.save();
}

export function handleBuyOrderRejected(event: BuyOrderRejected): void {
  let entity = new BuyOrder(event.params.buyOrderId.toString());

  entity.isRejected = true;

  entity.save();
}

export function handleBuyOrderRetracted(event: BuyOrderRetracted): void {
  let entity = new BuyOrder(event.params.buyOrderId.toString());

  entity.isClosed = true;

  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleSell(event: Sell): void {
  let entity = Selling.load(event.params.seller.toString());

  if (!entity) {
    entity = new Selling(event.params.seller.toString());
    entity.sellItems = [event.params.sellItemId.toString()];
  } else {
    entity.sellItems.push(event.params.sellItemId.toString());
  }

  entity.orderPrice = event.params.orderPrice;

  entity.save();
}

export function handleSellItemCreated(event: SellItemCreated): void {
  let entity = new SellItem(event.params.orderId.toString());

  entity.tokenAddress = event.params.tokenAddress;
  entity.tokenId = event.params.tokenId;
  entity.initPrice = event.params.initPrice;
  entity.seller = event.params.seller;
  entity.isForSale = true;

  let nft = Nft.bind(event.params.tokenAddress);

  entity.uri = nft.tokenURI(event.params.tokenId);

  entity.save();
}

export function handleSellItemRetracted(event: SellItemRetracted): void {
  let entity = new SellItem(event.params.sellItemId.toString());

  entity.isForSale = false;

  entity.save();
}
