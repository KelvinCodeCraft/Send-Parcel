class CustomParcel {
    parcelID: number;
    sender: string;
    senderLocation: string;
    price: number;
    lat: number;
    lng: number;
    senderLat: number;
    senderLng: number;
    parcelDescription: string;
    receiverLocation: string;
    receiverNumber: number;
    receiverEmail: string;
    deliveryDate: string;
    deliveryStatus: string;

    constructor(
        parcelID: number,
        sender: string,
        senderLocation: string,
        price: number,
        lat: number,
        lng: number,
        senderLat: number,
        senderLng: number,
        parcelDescription: string,
        receiverLocation: string,
        receiverNumber: number,
        receiverEmail: string,
        deliveryDate: string,
        deliveryStatus: string
    ) {
        this.parcelID = parcelID;
        this.sender = sender;
        this.senderLocation = senderLocation;
        this.price = price;
        this.lat = lat;
        this.lng = lng;
        this.senderLat = senderLat;
        this.senderLng = senderLng;
        this.parcelDescription = parcelDescription;
        this.receiverLocation = receiverLocation;
        this.receiverNumber = receiverNumber;
        this.receiverEmail = receiverEmail;
        this.deliveryDate = deliveryDate;
        this.deliveryStatus = deliveryStatus;
    }
}

export default CustomParcel;
