const config = require('./utils/config');
const logger = require('./utils/logger');
const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
