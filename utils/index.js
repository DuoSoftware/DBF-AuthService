module.exports.ValidateParams = (json, required_list) => {
    var miss_list = [];
    for (let x of required_list) {
        if (!json[x]) {
            miss_list.push(x);
        }
    }

    if (miss_list.length > 0) {
        return { status: false, list: miss_list };
    } else {
        return { status: true, list: miss_list };
    }
};

module.exports.HasValidEmail = (email) => {
    var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let value = pattern.test(email);
    return value;
    // return pattern.test(email);
};

module.exports.GenerateAlphaNumericString = (strLen=8, includeSpecialCharacters=false) => {
    let p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        sChars = "!@#$%_~&",
        regPattern = '(?=.*\d)(?=.*[a-z])(?=.*[A-Z])';
    
    if (includeSpecialCharacters) {
        p += sChars;
        regPattern += `(?=.*[${sChars}])`;
    }
    
    let alphaStr;
    do {
        alphaStr = [...Array(strLen)].reduce(a=>a+p[~~(Math.random()*p.length)], '');
    } while (!RegExp(regPattern).test(alphaStr));

    return alphaStr;
}

module.exports.Success = (code, message, data) => {
    code = code || 200;

    let obj = {
        code: code,
        message: message,
        status: true
    }

    if (data != undefined) {
        obj['data'] = data;
    }

    return obj;
}

module.exports.Error = (code, message, data) => {
    code = code || 500;

    let obj = {
        code: code,
        status: false,
        message: message
    };

    if (data !== undefined) {
        obj.data = data;
    }

    return obj;
}