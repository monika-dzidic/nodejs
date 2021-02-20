exports.isFalsyObject = obj => !obj ||
    (Array.isArray(obj) && !obj.length) ||
    (typeof obj == 'object' && !Object.keys(obj).length) ? true : false
    
exports.isFalsy = val => val == undefined || val == null ? true : false