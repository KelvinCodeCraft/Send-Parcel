USE [SENDIT]
GO

CREATE PROCEDURE getAllParcels
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        id,
        senderEmail,
		senderNumber,
		receiverNumber,
        receiverEmail,
        dispatchedDate,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng, 
        deliveryStatus
    FROM dbo.PARCEL;
END;


