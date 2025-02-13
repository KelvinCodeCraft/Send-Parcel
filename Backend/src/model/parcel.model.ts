class CustomParcel {
    parcelID: number;
    sender: string;
    senderLocation: string;
    parcelWeight: string;
    price: string;
    lat: number;
    lng: number;
    senderLat: number;
    senderLng: number;
    parcelDescription: string;
    receiverLocation: string;
    receiverPhone: number;
    receiverEmail: string;
    deliveryDate: string;
    deliveryStatus: string;

    constructor(
        parcelID: number,
        sender: string,
        senderLocation: string,
        parcelWeight: string,
        price: string,
        lat: number,
        lng: number,
        senderLat: number,
        senderLng: number,
        parcelDescription: string,
        receiverLocation: string,
        receiverPhone: number,
        receiverEmail: string,
        deliveryDate: string,
        deliveryStatus: string
    ) {
        this.parcelID = parcelID;
        this.sender = sender;
        this.senderLocation = senderLocation;
        this.parcelWeight = parcelWeight;
        this.price = price;
        this.lat = lat;
        this.lng = lng;
        this.senderLat = senderLat;
        this.senderLng = senderLng;
        this.parcelDescription = parcelDescription;
        this.receiverLocation = receiverLocation;
        this.receiverPhone = receiverPhone;
        this.receiverEmail = receiverEmail;
        this.deliveryDate = deliveryDate;
        this.deliveryStatus = deliveryStatus;
    }
}

export default CustomParcel;
