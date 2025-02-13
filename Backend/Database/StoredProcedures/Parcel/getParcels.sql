USE [SENDIT]
GO

CREATE PROCEDURE getAllParcels
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        id,
        senderEmail,
        senderName,
        receiverName,
        receiverEmail,
        dispatchedDate,
        deliveryDate,
        parcelWeight,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng, 
        deliveryStatus
    FROM dbo.PARCEL;
END;
