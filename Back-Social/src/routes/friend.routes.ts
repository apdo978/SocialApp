import { Router } from 'express';
import { protect } from '../middlewares/auth';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends,
    removeFriend
} from '../controllers/friend.controller';
import { validateFriendRequest } from '../validators/friend.validator';

const router = Router();

// Friend requests
router.post('/request/:userId', protect, validateFriendRequest, sendFriendRequest);
router.put('/accept/:requestId', protect, acceptFriendRequest);
router.put('/reject/:requestId', protect, rejectFriendRequest);
router.get('/requests', protect, getFriendRequests);

// Friends management
router.get('/', protect, getFriends);
router.delete('/:friendId', protect, removeFriend);

export default router;
