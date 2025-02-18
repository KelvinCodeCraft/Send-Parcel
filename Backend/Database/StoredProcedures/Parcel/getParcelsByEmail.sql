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
        -- If role is invalid, return an error message
        RAISERROR('Invalid role specified. Use "sender" or "receiver".', 16, 1);
    END
END;
