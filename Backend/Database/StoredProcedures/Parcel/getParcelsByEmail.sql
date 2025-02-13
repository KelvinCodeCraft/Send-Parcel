USE [SENDIT]
GO

CREATE PROCEDURE getParcelsByEmail
    @email VARCHAR(200)
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
    WHERE senderEmail = @email OR receiverEmail = @email;
END;





