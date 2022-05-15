import express from 'express';
import { currentUserSetter } from '@am-gittix/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUserSetter, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
