const { format } = require('date-fns');

const formatDate = (date) => {
  return format(date, 'yy-MM-dd HH:mm');
};

module.exports = { formatDate };
