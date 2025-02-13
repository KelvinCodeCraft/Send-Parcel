USE [SENDIT]
GO

CREATE PROCEDURE getParcelById
    @id UNIQUEIDENTIFIER
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
    FROM dbo.PARCEL
    WHERE id = @id;
END;


