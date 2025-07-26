import { Router } from 'express';
import { protect } from '../middlewares/auth';
import {
  accessChat as CreatOraccessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} from '../controllers/chat.controller';
import { validateCreateGroup, validateRenameGroup, validateGroupMembers } from '../validators';

const router = Router();

// Individual chats
router.route('/').get(protect, fetchChats)
                 .post(protect, CreatOraccessChat);

// Group chat routes
router.route('/group').post(protect, validateCreateGroup, createGroupChat);
router.route('/group/:chatId').put(protect, validateRenameGroup, renameGroup);
router.route('/group/:chatId/add').put(protect, validateGroupMembers, addToGroup);
router.route('/group/:chatId/remove').put(protect, validateGroupMembers, removeFromGroup);

export default router;
