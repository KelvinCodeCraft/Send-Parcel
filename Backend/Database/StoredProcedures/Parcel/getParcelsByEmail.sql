USE [SENDIT]
GO

CREATE OR ALTER PROCEDURE getParcelsByEmail
    @email VARCHAR(200),
    @role VARCHAR(10) -- 'sender' or 'receiver'
AS
BEGIN
    SET NOCOUNT ON;

    IF @role = 'sender'
    BEGIN
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
        WHERE senderEmail = @email;
    END
    ELSE IF @role = 'receiver'
    BEGIN
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
        WHERE receiverEmail = @email;
    END
    ELSE
    BEGIN
        -- If no role is specified, return all parcels related to the email
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
        WHERE senderEmail = @email OR receiverEmail = @email;
    END
END;

