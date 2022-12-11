
exports.match = (req) => {

  // remove white spaces and replace semi columns with comma and split
  let languages = req.headers['accept-language']?.replaceAll(/\s/g,'').replaceAll(/;/g,',').split(',');

  // see en / ar if they are found in languages, if not return en as default
  return languages?.find((element)=>element == 'en' || element == 'ar') ?? 'en' ;

}
