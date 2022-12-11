
exports.getPagination = (page, size) => {
  const limit = size ? +size : 20; // default limit 20
  page -= 1;
  const offset = page ? page * limit : 0;
  
  return { limit, offset };
}

exports.getPagingData = (_data, page, limit) => {
  const { count: totalItems, rows: data } = _data;
  const currentPage = page ? +page : 1;
  const total = totalItems;
  const totalPages = Math.ceil(total / limit);
  
  return { total, data, totalPages, currentPage };
}
