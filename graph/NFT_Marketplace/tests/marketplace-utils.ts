import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Buy,
  BuyOrderAccepted,
  BuyOrderCreated,
  BuyOrderRejected,
  BuyOrderRetracted,
  OwnershipTransferred,
  Sell,
  SellItemCreated
} from "../generated/Marketplace/Marketplace"

export function createBuyEvent(
  buyer: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  orderPrice: BigInt
): Buy {
  let buyEvent = changetype<Buy>(newMockEvent())

  buyEvent.parameters = new Array()

  buyEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  buyEvent.parameters.push(
    new ethereum.EventParam(
      "orderPrice",
      ethereum.Value.fromUnsignedBigInt(orderPrice)
    )
  )

  return buyEvent
}

export function createBuyOrderAcceptedEvent(
  buyOrderId: BigInt
): BuyOrderAccepted {
  let buyOrderAcceptedEvent = changetype<BuyOrderAccepted>(newMockEvent())

  buyOrderAcceptedEvent.parameters = new Array()

  buyOrderAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "buyOrderId",
      ethereum.Value.fromUnsignedBigInt(buyOrderId)
    )
  )

  return buyOrderAcceptedEvent
}

export function createBuyOrderCreatedEvent(
  buyer: Address,
  sellOrderId: BigInt,
  proposedPrice: BigInt,
  buyOrderId: BigInt
): BuyOrderCreated {
  let buyOrderCreatedEvent = changetype<BuyOrderCreated>(newMockEvent())

  buyOrderCreatedEvent.parameters = new Array()

  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "sellOrderId",
      ethereum.Value.fromUnsignedBigInt(sellOrderId)
    )
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposedPrice",
      ethereum.Value.fromUnsignedBigInt(proposedPrice)
    )
  )
  buyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "buyOrderId",
      ethereum.Value.fromUnsignedBigInt(buyOrderId)
    )
  )

  return buyOrderCreatedEvent
}

export function createBuyOrderRejectedEvent(
  buyOrderId: BigInt
): BuyOrderRejected {
  let buyOrderRejectedEvent = changetype<BuyOrderRejected>(newMockEvent())

  buyOrderRejectedEvent.parameters = new Array()

  buyOrderRejectedEvent.parameters.push(
    new ethereum.EventParam(
      "buyOrderId",
      ethereum.Value.fromUnsignedBigInt(buyOrderId)
    )
  )

  return buyOrderRejectedEvent
}

export function createBuyOrderRetractedEvent(
  buyOrderId: BigInt
): BuyOrderRetracted {
  let buyOrderRetractedEvent = changetype<BuyOrderRetracted>(newMockEvent())

  buyOrderRetractedEvent.parameters = new Array()

  buyOrderRetractedEvent.parameters.push(
    new ethereum.EventParam(
      "buyOrderId",
      ethereum.Value.fromUnsignedBigInt(buyOrderId)
    )
  )

  return buyOrderRetractedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createSellEvent(
  seller: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  orderPrice: BigInt
): Sell {
  let sellEvent = changetype<Sell>(newMockEvent())

  sellEvent.parameters = new Array()

  sellEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  sellEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  sellEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  sellEvent.parameters.push(
    new ethereum.EventParam(
      "orderPrice",
      ethereum.Value.fromUnsignedBigInt(orderPrice)
    )
  )

  return sellEvent
}

export function createSellItemCreatedEvent(
  seller: Address,
  tokenAddress: Address,
  tokenId: BigInt,
  initPrice: BigInt,
  orderId: BigInt
): SellItemCreated {
  let sellItemCreatedEvent = changetype<SellItemCreated>(newMockEvent())

  sellItemCreatedEvent.parameters = new Array()

  sellItemCreatedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  sellItemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenAddress",
      ethereum.Value.fromAddress(tokenAddress)
    )
  )
  sellItemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  sellItemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "initPrice",
      ethereum.Value.fromUnsignedBigInt(initPrice)
    )
  )
  sellItemCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )

  return sellItemCreatedEvent
}
