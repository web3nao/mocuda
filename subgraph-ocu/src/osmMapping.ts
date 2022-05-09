import { log } from "@graphprotocol/graph-ts";
import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { LogValue, OSM } from "../generated/MakerOSM/OSM";
import {
  Diss1Call,
  DissCall,
  Kiss1Call,
  KissCall,
  LogNote,
} from "../generated/MakerOSM/OSM";
import { OSMPrice, MedianizerPrice, OSMConsumer } from "../generated/schema";
// import { bytes, decimal, DEFAULT_DECIMALS } from "@protofire/subgraph-toolkit";
import { MakerOSMTemplate } from "../generated/templates";

export function handleLogValue(event: LogValue): void {
  let contract = OSM.bind(Address.fromString(event.address.toHexString()));
  let price = OSMPrice.load(event.address.toHexString());
  if (!price) {
    price = new OSMPrice(event.address.toHexString());

    let checkSource = contract.try_src();
    if (checkSource.reverted) {
      log.info("not an OSM", []);
      return;
    }
    price.medianizer = contract.src().toHex();
  }
  let delay = BigInt.fromI32(contract.hop());

  const priceMedianizer = price.medianizer;
  if (priceMedianizer) {
    let medianizerEntity = MedianizerPrice.load(priceMedianizer);
    if (medianizerEntity == null) {
      log.info("no associated medianizer", []);
      return;
    } else {
      price.nextValue = medianizerEntity.curValue;
    }
  }
  price.updatedTimeStamp = event.block.timestamp;
  price.updatedBlockNumber = event.block.number;
  price.transactionHash = event.transaction.hash;

  // let amount = Math.max(BigInt.zero().toI32(), BigInt.fromUnsignedBytes(event.params.val).toI32());

  // let amount = decimal.max(
  //   decimal.ZERO,
  //   decimal.fromBigInt(bytes.toUnsignedInt(event.params.val), DEFAULT_DECIMALS)
  // );
  price.curValue = BigInt.fromByteArray(event.params.val);
  price.nextTimestamp = event.block.timestamp.plus(delay);

  price.save();
}

export function handleKiss(call: Kiss1Call): void {
  let osmId = call.to.toHex();
  let consumerAddr = call.inputs.a;
  let consumer = OSMConsumer.load(osmId + "-" + consumerAddr.toHexString());
  if (consumer == null) {
    consumer = new OSMConsumer(osmId + "-" + consumerAddr.toHexString());
  }
  consumer.address = consumerAddr;
  consumer.osm = osmId;
  consumer.save();
}

export function handleKissNote(event: LogNote): void {
  let osmId = event.address.toHex();
  let consumerAddr = Address.fromBytes(event.params.arg1);
  // let consumerAddr = bytes.toAddress(event.params.arg1);

  //Is this actually an OSM?
  let contract = OSM.bind(event.address);
  let checkSource = contract.try_src();
  if (checkSource.reverted) {
    log.info("not an OSM", []);
    return;
  }

  let consumer = OSMConsumer.load(osmId + "-" + consumerAddr.toHexString());
  if (consumer == null) {
    consumer = new OSMConsumer(osmId + "-" + consumerAddr.toHexString());
  }
  consumer.address = event.params.arg1;
  consumer.osm = osmId;
  consumer.save();

  MakerOSMTemplate.create(event.address);
}

export function handleKisses(call: KissCall): void {
  let consumerAddresses = call.inputs.a;
  let osmId = call.to.toHex();

  for (let i = 0; i < consumerAddresses.length; i++) {
    let consumerAddr = consumerAddresses[i];
    let consumer = OSMConsumer.load(osmId + "-" + consumerAddr.toHexString());
    if (consumer == null) {
      consumer = new OSMConsumer(osmId + "-" + consumerAddr.toHexString());
    }
    consumer.address = consumerAddr;
    consumer.osm = osmId;
    consumer.save();
  }
}

export function handleDiss(call: Diss1Call): void {
  let osmId = call.to.toHex();
  let consumerAddr = call.inputs.a;
  let consumer = OSMConsumer.load(osmId + "-" + consumerAddr.toHexString());
  if (consumer !== null) {
    consumer.osm = "";
    consumer.save();
  }
}

export function handleDisses(call: DissCall): void {
  let consumerAddresses = call.inputs.a;
  let osmId = call.to.toHex();

  for (let i = 0; i < consumerAddresses.length; i++) {
    let consumerAddr = consumerAddresses[i];
    let consumer = OSMConsumer.load(osmId + "-" + consumerAddr.toHexString());
    if (consumer !== null) {
      consumer.osm = "";
      consumer.save();
    }
  }
}
