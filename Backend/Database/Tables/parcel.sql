
USE [SENDIT]
GO

CREATE TABLE PARCEL (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID() NOT NULL,
    senderEmail VARCHAR(200) NOT NULL,
    senderNumber VARCHAR(200) NOT NULL, 
    receiverEmail VARCHAR(200) NOT NULL,
    receiverNumber VARCHAR(200) NOT NULL, 
    dispatchedDate DATE NOT NULL,
    price FLOAT NOT NULL,
    receiverLat VARCHAR(200) NOT NULL,
    receiverLng VARCHAR(200) NOT NULL,
    senderLat VARCHAR(200) NOT NULL,
    senderLng VARCHAR(200) NOT NULL,
	deliveryStatus VARCHAR(200) NOT NULL
);




