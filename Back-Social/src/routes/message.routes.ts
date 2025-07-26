import { Router } from 'express';
import { protect } from '../middlewares/auth';
import {
  allMessages,
  sendMessage,
  markMessagesAsRead,
} from '../controllers/message.controller';
import { validateSendMessage } from '../validators';

const router = Router();

router.route('/:chatId').get(protect, allMessages);
router.route('/').post(protect, validateSendMessage, sendMessage, markMessagesAsRead);
router.route('/:chatId/read').put(protect, markMessagesAsRead);

export default router;
