var facebookAccounts = [ {
    
	c_user: "100006954614480",
	datr: "Wy3bVka-4PgWFQJlb_Blr__a",
	xs: "94%3AsJcMo1PLhivCMg%3A2%3A1459468214%3A9842"
    
},
{
    	c_user: "100011642983324",
	datr: "_aMOV3T-zNHgE-f1YB1nFmjR",
	xs: "107%3AVSKtXj8Gc4bTtA%3A2%3A1460577315%3A19085"
    
},
{
	    c_user: "100010269695747",
	datr: "AnUCV5Co0H9_VZgF5pqIH0eu",
	xs: "36%3ANl0l9eit3sdNAA%3A2%3A1460381531%3A6950"
	    
},
{
	    c_user: "100009003000179",
	datr: "qGXKVvNSvDWI1jAE6armgsiJ",
	xs: "56%3AYPlXc9Ve3mdqeQ%3A2%3A1460515109%3A14242"
	    
},
{
	    c_user: "100009818897639",
	datr: "ZgWiVne7idPx59pYET6epprN", 
	xs: "40%3A9ptL2xjdpIlZ9A%3A2%3A1459965614%3A3382"
	    
},
{
    c_user: "100001553736210",
datr: "J-QNV6fAx6WM9jQV-MWuVDUY",
xs: "47%3AyknEHXcfN7TbPg%3A2%3A1460528180%3A12311"
    
},
{
    c_user: "100006864008425",
datr: "gXwOV927MyUQpUa5g0isTL6y",
xs: "131%3AS4lw95BaZhcpaQ%3A2%3A1460567186%3A2764"
    
},
{
    c_user: "100008035118098",
datr: "USjvVtjJsJ_hKElSljhxXOjk",
xs: "17%3A-vy-UHSumR5cqA%3A2%3A1460660069%3A197"
    
},
{
    c_user: "100006727454141",
datr: "JjAHV4-QEACwhr_BrOms1XLG",
xs: "179%3AjNRprRs1C893ig%3A2%3A1460088891%3A3736"
    
},
{
    c_user: "100003434599671", 
datr: "52ncVqGMeqaz1S0zNMr96MtF", 
xs: "53%3AlCZA9Bctl7mn_w%3A2%3A1457316983%3A2236"
    
},
{
    c_user: "100010538351639", 
datr: "2IAUVkTjZQ5KlOtNrwGCdbJV", 
xs: "162%3AuManLPHmyue0yg%3A2%3A1460423610%3A16723"
    
},
{
    c_user: "100006316809206", 
datr: "9af6Vt66DhKipk4sX9opu1wv", 
xs: "173%3AhZn2_oq8G_MqeA%3A2%3A1459267583%3A9883"
    
},
{
    c_user: "100006864008425", 
datr: "WsYOV3mpNIjkX3fMbmLbQojR", 
xs: "226%3AH4llKnn1C-Iucw%3A2%3A1460586098%3A2764"}];
    

var AgarioClient = require('agario-client');
extend = require("extend");

function facebookManager() {
    this.activeAccounts = [];
    this.usedAccounts = [];
    this.accounts = [];
}
facebookManager.prototype.generateTokens = function(settings, callback) {
    /*
     * Object   Options:
     * 
     * Boolean  owned;      default: false;
     * Boolean  maxMass;    default: false;
     * Int      minLevel;   default: 0;
     * Int      maxLevel;   default: 100;
     */
    defaultOptions = {
        owned: false,
        maxMass: false,
        minLevel: 0,
        maxLevel: 100
    };
    options = defaultOptions;
    if (typeof settings != "undefined") {
        options = extend(options, settings);
        console.log(options);
    }
    var manager = this;
    console.log("generating tokens...");
    if (this.accounts.length < 1) {
        console.log("NO ACCOUNTS TO GENERATE TOKEN");
    }
    var amountOfAccounts = this.accounts.length;
    var amountOfTriedAccounts = 0;
    //    var loopIndex = 0;
    this.accounts.map(function(cookie) {
        //skip facebook accounts that are not owned by me 
        //if we want only facebook accounts that are mine
        if (typeof cookie.owned != "undefined" && options.owned && !cookie.owned) return;

        //skip facebook accounts that are not the maximum reachable mass
        if (typeof cookie.lvl != "undefined" && options.maxMass && cookie.lvl < 34) return;

        //skip facebook accounts that are lower than this level
        if (typeof cookie.lvl != "undefined" && cookie.lvl < options.minLevel) return;

        //skip facebook accounts that are higher than this level
        if (typeof cookie.lvl != "undefined" && cookie.lvl > options.maxLevel) return;


        var account = new AgarioClient.Account();

        //Login through facebook on http://agar.io/ and copy cookies c_user,datr,xs from http://www.facebook.com/ here
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;
        //        setTimeout(function () {
        //Request token
        account.requestFBToken(function(token, info) {
            if (token) {
                manager.activeAccounts.push({
                    cookie: cookie,
                    token: token
                });
                console.log("TOTAL TOKENS:", manager.activeAccounts.length);
            } else {
                console.log('Failed to get token!', cookie.c_user);
            }
            newAccountValidated();
        });
        //    },500 * loopIndex);
        //        loopIndex++;
    });

    function newAccountValidated() {
        amountOfTriedAccounts++;

        if (amountOfAccounts == amountOfTriedAccounts) {
            if (typeof callback == "function") {
                callback();
            }
        }
    }
};

facebookManager.prototype.generateToken = function(singleAccount) {
    var manager = this;
    [singleAccount].map(function(cookie) {
        var account = new AgarioClient.Account();

        //Login through facebook on http://agar.io/ and copy cookies c_user,datr,xs from http://www.facebook.com/ here
        account.c_user = cookie.c_user;
        account.datr = cookie.datr;
        account.xs = cookie.xs;

        //Request token
        account.requestFBToken(function(token, info) {
            if (token) {
                console.log('Got new token: ' + token);
                manager.activeAccounts.push(token);
                console.log("");
                console.log("TOTAL TOKENS:", manager.activeAccounts.length)
                console.log("");
            } else {
                console.log('Failed to get token!', cookie.c_user);
                if (info.error)
                    console.log('Request error: ' + info.error);
                if (info.res && info.res.statusCode)
                    console.log('HTTP code: ' + info.res.statusCode);
                if (info.res && info.res.headers && info.res.headers.location)
                    console.log('Redirect: ' + info.res.headers.location);
                console.log("retrying");
                manager.generateToken(cookie);
                //if(info.data) console.log('HTML: ' + info.data);
            }
        });

    });
};
facebookManager.prototype.setAccounts = function(accounts) {
    this.accounts = accounts;
}

facebookManager.prototype.hasAvailableToken = function() {
    if (this.activeAccounts.length > 0) {
        return true;
    }
    return false;
}

facebookManager.prototype.getToken = function() {
    var account = this.activeAccounts.pop();
    this.usedAccounts.push(account);
    return account.token;
};
facebookManager.prototype.returnToken = function(token) {
    for (var i = 0; i < this.usedAccounts.length; i++) {
        if (this.usedAccounts[i].token === token) {
            this.activeAccounts.push(this.usedAccounts[i]);
            this.usedAccounts.splice(i, 1);
            return;
        }

    }
    throw "No used token found for: " + token;
}

var manager = new facebookManager();
manager.setAccounts(facebookAccounts);
module.exports = manager;