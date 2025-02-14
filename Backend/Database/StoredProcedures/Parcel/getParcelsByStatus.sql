USE [SENDIT]
GO

CREATE PROCEDURE getParcelsByStatus
    @status VARCHAR(20)
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
    WHERE deliveryStatus = @status;
END;