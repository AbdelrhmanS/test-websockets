const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const auctions = {};

io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    };

    socket.on('getAuction', auctionId => {
        console.log('getAuction', auctionId);
        safeJoin(auctionId);
        socket.emit('auction', auctions[auctionId]);
    });

    socket.on('getAuction', auctionId => {
        console.log('getAuction', auctionId);
        safeJoin(auctionId);
        socket.emit('auction', auctions[auctionId]);
    });

    socket.on('addAuction', auction => {
        console.log('addAuction', auction);
        auctions[auction.id] = auction;
        safeJoin(auction.id);
        io.emit('auctions', Object.keys(auctions));
        socket.emit('auctions', auction);
    });

    socket.on('editAuction', auction => {
        auction.totalBids += 1;
        console.log('editAuction', auction);
        auctions[auction.id] = auction;
        socket.to(auction.id).emit('auction', auction);
    });

    socket.on('addBid', bidDetails => {
        const auction = auctions[bidDetails.auctionId];
        console.log('addBid', bidDetails, auction);
        auction.totalBids += 1;
        if (!auction.partners[bidDetails.partnerId]) {
            auction.partners[bidDetails.partnerId] = {bids: []}
        }
        auction.partners[bidDetails.partnerId].bids.push(bidDetails.bid);
        auctions[bidDetails.auctionId] = auction;
        socket.to(bidDetails.auctionId).emit('auction', auction);
    });

    io.emit('auctions', Object.keys(auctions));

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Listening on port 4444');
});
