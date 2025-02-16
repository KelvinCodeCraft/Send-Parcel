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
        receiverEmail,
		senderNumber,
		receiverNumber,
        dispatchedDate,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng,
        deliveryStatus
    FROM dbo.PARCEL
    WHERE deliveryStatus = @status;
END;

