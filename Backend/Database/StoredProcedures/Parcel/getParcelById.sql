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
        receiverEmail,
		phoneNumber,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng,
        deliveryStatus
    FROM dbo.PARCEL
    WHERE id = @id;
END;


