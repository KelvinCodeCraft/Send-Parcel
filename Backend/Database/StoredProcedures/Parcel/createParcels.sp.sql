USE [SENDIT]
GO

-- Now create the stored procedure for inserting a new parcel.
CREATE PROCEDURE createParcel (
    @senderEmail VARCHAR(200),
    @senderName VARCHAR(200), 
    @receiverName VARCHAR(200),
    @receiverEmail VARCHAR(200),
    @dispatchedDate DATE,
    @deliveryDate DATE,
    @parcelWeight INT,
    @price INT,
    @receiverLat VARCHAR(200),
    @receiverLng VARCHAR(200),
    @senderLat VARCHAR(200),
    @senderLng VARCHAR(200),
    @deliveryStatus VARCHAR(200)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.PARCEL (
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
    )
    VALUES (
      @senderEmail,
      @senderName,
      @receiverName,
      @receiverEmail,
      @dispatchedDate,
      @deliveryDate,
      @parcelWeight,
      @price,
      @receiverLat,
      @receiverLng,
      @senderLat,
      @senderLng,
      @deliveryStatus
    );
END;
GO

