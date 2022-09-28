// chrome.storage.sync.clear(); 

async function login(passcode) {
    var enter_password = document.querySelector("#passcode");
    enter_password.click();
    var input_password = document.querySelector("[name='passcode']");
    input_password.value = passcode;
    enter_password.click();
}

async function injectScript(passcode) {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.scripting.executeScript(
        {
            target: {tabId: tab.id, allFrames: true},
            func: login,
            args: [passcode]
        },
        () => {});
}

async function loginHttp(sid, passcode) {
  const promptResponse = await fetch(
    "https://api-d594f029.duosecurity.com/frame/v4/prompt",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "sec-ch-ua":
          '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
      body: new URLSearchParams({
        factor: "Passcode",
        device: "null",
        passcode: passcode,
        sid: sid,
      }),
    }
  );
  const promptData = await promptResponse.json();
  const txid = promptData.response.txid;

  alert(txid);

  const statusResponse = await fetch(
    "https://api-d594f029.duosecurity.com/frame/v4/status",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        "sec-ch-ua":
          '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
      },
      body: new URLSearchParams({
        txid: txid,
        sid: sid,
      }),
    }
  );

  const statusData = await statusResponse.text();
  alert(statusData);
  const testRes = await fetch('https://api-d594f029.duosecurity.com/frame/v4/oidc/exit', {
    method: 'POST',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"'
    },
    body: new URLSearchParams({
        'sid': sid,
        'txid': txid,
        'factor': 'Duo Mobile Passcode',
        'device_key': '',
        '_xsrf': 'f47b30aefe894db4839c576f705af5c6',
        'dampen_choice': 'false'
    }),
  });
  // const testRes = await fetch(
  //   "https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO?execution=e22s3&_eventId_proceed=1",
  //   {
  //     headers: {
  //       Accept:
  //         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  //       "Accept-Language": "en-US,en;q=0.9",
  //       "Cache-Control": "max-age=0",
  //       Connection: "keep-alive",
  //       "Sec-Fetch-Dest": "document",
  //       "Sec-Fetch-Mode": "navigate",
  //       "Sec-Fetch-Site": "cross-site",
  //       "Upgrade-Insecure-Requests": "1",
  //       "User-Agent":
  //         "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
  //       "sec-ch-ua":
  //         '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
  //       "sec-ch-ua-mobile": "?0",
  //       "sec-ch-ua-platform": '"macOS"',
  //     },
  //   }
  // );

  const testData = await testRes.text();
  alert(testData);
}

chrome.storage.sync.get(null, async (data) => {
    const uclaUrl = "https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO";
    //Regex unused 
    // let linkRegEx = new RegExp('https:\/\/shb\.ais\.ucla\.edu\/shibboleth-idp\/profile\/SAML2\/Redirect\/SSO\?execution=e.s4')
    //Authentication usually happens on stage 4
    //https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO?execution=e1s4
    let HOTPSecret = data.HOTPSecret;

    result = await chrome.tabs.query({'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT});
    const currentUrl = result[0].url;

    // https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/Redirect/SSO
    if (HOTPSecret == undefined) // the user has not submitted a correct activation link
    {
        document.getElementById('submit').onclick = function () {
            // Get HOTP secret from Duo
            let link = document.getElementById('link').value;
            let host = 'api' + link.substring(link.indexOf('-'), link.indexOf('com') + 3);
            let key = link.substring(link.lastIndexOf('/') + 1);
            let duoURL = 'https://' + host + '/push/v2/activation/' + key + '?customer_protocol=1';
            let cors_anywhere = 'https://mikequ1.herokuapp.com/';
            duoURL = cors_anywhere + duoURL;

            let http = new XMLHttpRequest();
            http.open('POST', duoURL, true);
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.onload = function () {
                let obj = JSON.parse(this.responseText);
                if (obj.stat == 'OK') { // on success
                    HOTPSecret = obj.response.hotp_secret;
                    chrome.storage.sync.set({ HOTPSecret });
                    document.getElementById('setUp').classList.add('hidden');
                    document.getElementById('setUpSuccess').classList.remove('hidden');
                }
                else // on failure
                    alert('Something went wrong. Maybe the activation link has been used.\n\nPlease retry the previous steps. Thank you!')
            };
            http.send('jailbroken=false&architecture=arm64&region=US&app_id=com.duosecurity.duomobile&full_disk_encryption=true&passcode_status=true&platform=Android&app_version=3.49.0&app_build_number=323001&version=11&manufacturer=unknown&language=en&model=Easy%20Duo%20Authentication&security_patch_level=2021-02-01');
        };
    }

    else if (currentUrl.includes("duosecurity.com")) 
    // calculate and display the next HOTP passcode
    {

        document.getElementById('setUp').classList.add('hidden');
        document.getElementById('setUpSuccess').classList.add('hidden');
        document.getElementById('displayPasscode').classList.remove('hidden');
        document.getElementById('wrongUrl').classList.add('hidden');

        let request_url_end_index = currentUrl.indexOf("?");
        let request_url = currentUrl.substring(0, request_url_end_index);
        let sid_start_index = currentUrl.indexOf("sid=") + 4;
        let sid = currentUrl.substring(sid_start_index);


        function calculatePasscode() {
            let HOTP = new jsOTP.hotp();
            return HOTP.getOtp(HOTPSecret, count);
        }

        document.getElementById('retry').onclick = function () {
            // count += 1;
            count = 9;
            passcode = calculatePasscode(count);

            // let login_payload = "factor=Passcode&device=null&passcode=" + passcode + "&sid=" + sid + "&jailbroken=false&architecture=arm64&region=US&app_id=com.duosecurity.duomobile&full_disk_encryption=true&passcode_status=true&platform=Android&app_version=3.49.0&app_build_number=323001&version=11&manufacturer=unknown&language=en&model=Easy%20Duo%20Authentication&security_patch_level=2021-02-01";
            loginHttp(sid, passcode)


            // fetch('https://api-d594f029.duosecurity.com/frame/v4/status', {
            //     method: 'POST',
            //     headers: {
            //         'Accept': '*/*',
            //         'Accept-Language': 'en-US,en;q=0.9',
            //         'Connection': 'keep-alive',
            //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            //         'Origin': 'https://api-d594f029.duosecurity.com',
            //         'Referer': 'https://api-d594f029.duosecurity.com/frame/v4/auth/prompt?sid=frameless-18bb6104-00b9-4d70-a6a1-2e5d84f8cb80',
            //         'Sec-Fetch-Dest': 'empty',
            //         'Sec-Fetch-Mode': 'cors',
            //         'Sec-Fetch-Site': 'same-origin',
            //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            //         'X-Xsrftoken': '1dc1407e14ab44e2b4c1a32234b7a544',
            //         'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
            //         'sec-ch-ua-mobile': '?0',
            //         'sec-ch-ua-platform': '"macOS"'
            //     },
            //     body: new URLSearchParams({
            //         'txid': '9decaccd-7d97-4ef9-93d8-697d88f85471',
            //         'sid': sid
            //     })
            // });


            // alert(login_payload);
            // let xhr = new XMLHttpRequest();
            // xhr.open('POST', request_url, true);
            // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
            // xhr.onload = () => alert(xhr.responseText);
            // xhr.send(login_payload);

            //injectScript(passcode);
            chrome.storage.sync.set({ count });
        };

        let count = data.count;
        HOTPSecret = data.HOTPSecret;
        if (count == undefined) {
            count = 0;
        }
        document.getElementById('counter').innerHTML = count;
        document.getElementById('retry').click();

    } else {
        document.getElementById('setUp').classList.add('hidden');
        document.getElementById('setUpSuccess').classList.add('hidden');
        document.getElementById('displayPasscode').classList.add('hidden');
        document.getElementById('wrongUrl').classList.remove('hidden');
    }
});

// Codes from https://github.com/jiangts/JS-OTP to generate HOTP passcodes
(function(){var r,e;e=function(){function r(r,e){if(this.expiry=null!=r?r:30,this.length=null!=e?e:6,this.length>8||this.length<6)throw"Error: invalid code length"}return r.prototype.dec2hex=function(r){return(r<15.5?"0":"")+Math.round(r).toString(16)},r.prototype.hex2dec=function(r){return parseInt(r,16)},r.prototype.base32tohex=function(r){var e,n,t,o,i;for("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",e="",t="",o=0;o<r.length;)i="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(r.charAt(o).toUpperCase()),e+=this.leftpad(i.toString(2),5,"0"),o++;for(o=0;o+4<=e.length;)n=e.substr(o,4),t+=parseInt(n,2).toString(16),o+=4;return t},r.prototype.leftpad=function(r,e,n){return e+1>=r.length&&(r=Array(e+1-r.length).join(n)+r),r},r.prototype.getOtp=function(r,e){var n,t,o,i,h,w,u;if(null==e&&(e=(new Date).getTime()),o=this.base32tohex(r),n=Math.round(e/1e3),u=this.leftpad(this.dec2hex(Math.floor(n/this.expiry)),16,"0"),(w=new jsSHA("SHA-1","HEX")).setHMACKey(o,"HEX"),w.update(u),"KEY MUST BE IN BYTE INCREMENTS"===(t=w.getHMAC("HEX")))throw"Error: hex key must be in byte increments";return i=this.hex2dec(t.substring(t.length-1)),h=(h=(this.hex2dec(t.substr(2*i,8))&this.hex2dec("7fffffff"))+"").substr(h.length-this.length,this.length)},r}(),r=function(){function r(r){if(this.length=null!=r?r:6,this.length>8||this.length<6)throw"Error: invalid code length"}return r.prototype.uintToString=function(r){var e;return e=String.fromCharCode.apply(null,r),decodeURIComponent(escape(e))},r.prototype.getOtp=function(r,e){var n,t,o,i,h;return(i=new jsSHA("SHA-1","HEX")).setHMACKey(r,"TEXT"),counterString=("0000000000000000"+e.toString(16)).slice(-16),i.update(counterString),n=i.getHMAC("HEX"),h=(127&(t=this.hexToBytes(n))[o=15&t[19]])<<24|(255&t[o+1])<<16|(255&t[o+2])<<8|255&t[o+3],(h+="").substr(h.length-this.length,this.length)},r.prototype.intToBytes=function(r){var e,n;for(e=[],n=7;n>=0;)e[n]=255&r,r>>=8,--n;return e},r.prototype.hexToBytes=function(r){var e,n,t;for(n=[],t=0,e=r.length;t<e;)n.push(parseInt(r.substr(t,2),16)),t+=2;return n},r}(),window.jsOTP={},jsOTP.totp=e,jsOTP.hotp=r}).call(this);var SUPPORTED_ALGS=7;!function(r){"use strict";function e(r,e){this.highOrder=r,this.lowOrder=e}function n(r,e,n){var t,o,i,h,w,u,d=r.length;if(t=e||[0],u=(n=n||0)>>>3,0!=d%2)throw new Error("String of HEX type must be in byte increments");for(o=0;o<d;o+=2){if(i=parseInt(r.substr(o,2),16),isNaN(i))throw new Error("String of HEX type contains invalid characters");for(h=(w=(o>>>1)+u)>>>2;t.length<=h;)t.push(0);t[h]|=i<<8*(3-w%4)}return{value:t,binLen:4*d+n}}function t(r,e,n){var t,o,i,h,w,u=[];for(u=e||[0],i=(n=n||0)>>>3,o=0;o<r.length;o+=1)t=r.charCodeAt(o),h=(w=o+i)>>>2,u.length<=h&&u.push(0),u[h]|=t<<8*(3-w%4);return{value:u,binLen:8*r.length+n}}function o(r,e,n){var t,o,i,h,w,u,d,l,f=[],a=0;if(f=e||[0],u=(n=n||0)>>>3,-1===r.search(/^[a-zA-Z0-9=+\/]+$/))throw new Error("Invalid character in base-64 string");if(w=r.indexOf("="),r=r.replace(/\=/g,""),-1!==w&&w<r.length)throw new Error("Invalid '=' found in base-64 string");for(t=0;t<r.length;t+=4){for(h=r.substr(t,4),i=0,o=0;o<h.length;o+=1)i|="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[o])<<18-6*o;for(o=0;o<h.length-1;o+=1){for(d=(l=a+u)>>>2;f.length<=d;)f.push(0);f[d]|=(i>>>16-8*o&255)<<8*(3-l%4),a+=1}}return{value:f,binLen:8*a+n}}function i(r,e){var n,t,o="",i=4*r.length;for(n=0;n<i;n+=1)t=r[n>>>2]>>>8*(3-n%4),o+="0123456789abcdef".charAt(t>>>4&15)+"0123456789abcdef".charAt(15&t);return e.outputUpper?o.toUpperCase():o}function h(r,e){var n,t,o,i,h,w,u="",d=4*r.length;for(n=0;n<d;n+=3)for(i=n+1>>>2,h=r.length<=i?0:r[i],i=n+2>>>2,w=r.length<=i?0:r[i],o=(r[n>>>2]>>>8*(3-n%4)&255)<<16|(h>>>8*(3-(n+1)%4)&255)<<8|w>>>8*(3-(n+2)%4)&255,t=0;t<4;t+=1)8*n+6*t<=32*r.length?u+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(o>>>6*(3-t)&63):u+=e.b64Pad;return u}function w(r){var e,n,t="",o=4*r.length;for(e=0;e<o;e+=1)n=r[e>>>2]>>>8*(3-e%4)&255,t+=String.fromCharCode(n);return t}function u(r){var e,n={outputUpper:!1,b64Pad:"="};if(e=r||{},n.outputUpper=e.outputUpper||!1,n.b64Pad=e.b64Pad||"=","boolean"!=typeof n.outputUpper)throw new Error("Invalid outputUpper formatting option");if("string"!=typeof n.b64Pad)throw new Error("Invalid b64Pad formatting option");return n}function d(r,e){var i;switch(e){case"UTF8":case"UTF16BE":case"UTF16LE":break;default:throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE")}switch(r){case"HEX":i=n;break;case"TEXT":i=function(r,n,t){return function(r,e,n,t){var o,i,h,w,u,d,l=[],f=[],a=0;if(l=n||[0],w=(t=t||0)>>>3,"UTF8"===e)for(i=0;i<r.length;i+=1)for(f=[],128>(o=r.charCodeAt(i))?f.push(o):2048>o?(f.push(192|o>>>6),f.push(128|63&o)):55296>o||57344<=o?f.push(224|o>>>12,128|o>>>6&63,128|63&o):(i+=1,o=65536+((1023&o)<<10|1023&r.charCodeAt(i)),f.push(240|o>>>18,128|o>>>12&63,128|o>>>6&63,128|63&o)),h=0;h<f.length;h+=1){for(u=(d=a+w)>>>2;l.length<=u;)l.push(0);l[u]|=f[h]<<8*(3-d%4),a+=1}else if("UTF16BE"===e||"UTF16LE"===e)for(i=0;i<r.length;i+=1){for(o=r.charCodeAt(i),"UTF16LE"===e&&(o=(h=255&o)<<8|o>>>8),u=(d=a+w)>>>2;l.length<=u;)l.push(0);l[u]|=o<<8*(2-d%4),a+=2}return{value:l,binLen:8*a+t}}(r,e,n,t)};break;case"B64":i=o;break;case"BYTES":i=t;break;default:throw new Error("format must be HEX, TEXT, B64, or BYTES")}return i}function l(r,e){return r<<e|r>>>32-e}function f(r,e){return r>>>e|r<<32-e}function a(r,n){var t=new e(r.highOrder,r.lowOrder);return 32>=n?new e(t.highOrder>>>n|t.lowOrder<<32-n&4294967295,t.lowOrder>>>n|t.highOrder<<32-n&4294967295):new e(t.lowOrder>>>n-32|t.highOrder<<64-n&4294967295,t.highOrder>>>n-32|t.lowOrder<<64-n&4294967295)}function s(r,e){return r>>>e}function O(r,n){return 32>=n?new e(r.highOrder>>>n,r.lowOrder>>>n|r.highOrder<<32-n&4294967295):new e(0,r.highOrder>>>n-32)}function g(r,e,n){return r^e^n}function c(r,e,n){return r&e^~r&n}function p(r,n,t){return new e(r.highOrder&n.highOrder^~r.highOrder&t.highOrder,r.lowOrder&n.lowOrder^~r.lowOrder&t.lowOrder)}function S(r,e,n){return r&e^r&n^e&n}function E(r,n,t){return new e(r.highOrder&n.highOrder^r.highOrder&t.highOrder^n.highOrder&t.highOrder,r.lowOrder&n.lowOrder^r.lowOrder&t.lowOrder^n.lowOrder&t.lowOrder)}function A(r){return f(r,2)^f(r,13)^f(r,22)}function H(r){var n=a(r,28),t=a(r,34),o=a(r,39);return new e(n.highOrder^t.highOrder^o.highOrder,n.lowOrder^t.lowOrder^o.lowOrder)}function v(r){return f(r,6)^f(r,11)^f(r,25)}function T(r){var n=a(r,14),t=a(r,18),o=a(r,41);return new e(n.highOrder^t.highOrder^o.highOrder,n.lowOrder^t.lowOrder^o.lowOrder)}function b(r){return f(r,7)^f(r,18)^s(r,3)}function P(r){var n=a(r,1),t=a(r,8),o=O(r,7);return new e(n.highOrder^t.highOrder^o.highOrder,n.lowOrder^t.lowOrder^o.lowOrder)}function U(r){return f(r,17)^f(r,19)^s(r,10)}function y(r){var n=a(r,19),t=a(r,61),o=O(r,6);return new e(n.highOrder^t.highOrder^o.highOrder,n.lowOrder^t.lowOrder^o.lowOrder)}function m(r,e){var n=(65535&r)+(65535&e);return(65535&(r>>>16)+(e>>>16)+(n>>>16))<<16|65535&n}function C(r,e,n,t){var o=(65535&r)+(65535&e)+(65535&n)+(65535&t);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16))<<16|65535&o}function L(r,e,n,t,o){var i=(65535&r)+(65535&e)+(65535&n)+(65535&t)+(65535&o);return(65535&(r>>>16)+(e>>>16)+(n>>>16)+(t>>>16)+(o>>>16)+(i>>>16))<<16|65535&i}function R(r,n){var t,o,i;return t=(65535&r.lowOrder)+(65535&n.lowOrder),i=(65535&(o=(r.lowOrder>>>16)+(n.lowOrder>>>16)+(t>>>16)))<<16|65535&t,t=(65535&r.highOrder)+(65535&n.highOrder)+(o>>>16),new e((65535&(o=(r.highOrder>>>16)+(n.highOrder>>>16)+(t>>>16)))<<16|65535&t,i)}function x(r,n,t,o){var i,h,w;return i=(65535&r.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder)+(65535&o.lowOrder),w=(65535&(h=(r.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o.lowOrder>>>16)+(i>>>16)))<<16|65535&i,i=(65535&r.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(65535&o.highOrder)+(h>>>16),new e((65535&(h=(r.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o.highOrder>>>16)+(i>>>16)))<<16|65535&i,w)}function k(r,n,t,o,i){var h,w,u;return h=(65535&r.lowOrder)+(65535&n.lowOrder)+(65535&t.lowOrder)+(65535&o.lowOrder)+(65535&i.lowOrder),u=(65535&(w=(r.lowOrder>>>16)+(n.lowOrder>>>16)+(t.lowOrder>>>16)+(o.lowOrder>>>16)+(i.lowOrder>>>16)+(h>>>16)))<<16|65535&h,h=(65535&r.highOrder)+(65535&n.highOrder)+(65535&t.highOrder)+(65535&o.highOrder)+(65535&i.highOrder)+(w>>>16),new e((65535&(w=(r.highOrder>>>16)+(n.highOrder>>>16)+(t.highOrder>>>16)+(o.highOrder>>>16)+(i.highOrder>>>16)+(h>>>16)))<<16|65535&h,u)}function B(r){var n,t,o;if("SHA-1"===r&&1&SUPPORTED_ALGS)n=[1732584193,4023233417,2562383102,271733878,3285377520];else{if(!(6&SUPPORTED_ALGS))throw new Error("No SHA variants supported");switch(t=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],r){case"SHA-224":n=t;break;case"SHA-256":n=o;break;case"SHA-384":n=[new e(3418070365,t[0]),new e(1654270250,t[1]),new e(2438529370,t[2]),new e(355462360,t[3]),new e(1731405415,t[4]),new e(41048885895,t[5]),new e(3675008525,t[6]),new e(1203062813,t[7])];break;case"SHA-512":n=[new e(o[0],4089235720),new e(o[1],2227873595),new e(o[2],4271175723),new e(o[3],1595750129),new e(o[4],2917565137),new e(o[5],725511199),new e(o[6],4215389547),new e(o[7],327033209)];break;default:throw new Error("Unknown SHA variant")}}return n}function D(r,e){var n,t,o,i,h,w,u,d=[],f=c,a=g,s=S,O=l,p=m,E=L;for(n=e[0],t=e[1],o=e[2],i=e[3],h=e[4],u=0;u<80;u+=1)d[u]=u<16?r[u]:O(d[u-3]^d[u-8]^d[u-14]^d[u-16],1),w=u<20?E(O(n,5),f(t,o,i),h,1518500249,d[u]):u<40?E(O(n,5),a(t,o,i),h,1859775393,d[u]):u<60?E(O(n,5),s(t,o,i),h,2400959708,d[u]):E(O(n,5),a(t,o,i),h,3395469782,d[u]),h=i,i=o,o=O(t,30),t=n,n=w;return e[0]=p(n,e[0]),e[1]=p(t,e[1]),e[2]=p(o,e[2]),e[3]=p(i,e[3]),e[4]=p(h,e[4]),e}function G(r,e,n,t){var o,i,h;for(h=15+(e+65>>>9<<4);r.length<=h;)r.push(0);for(r[e>>>5]|=128<<24-e%32,r[h]=e+n,i=r.length,o=0;o<i;o+=16)t=D(r.slice(o,o+16),t);return t}var M,X;function _(r,n,t){var o,i,h,w,u,d,l,f,a,s,O,g,B,D,G,_,F,I,Y,N,j,K,Z,z,J,Q,V,W=[];if(("SHA-224"===t||"SHA-256"===t)&&2&SUPPORTED_ALGS)O=64,B=1,Z=Number,D=m,G=C,_=L,F=b,I=U,Y=A,N=v,K=S,j=c,V=M;else{if("SHA-384"!==t&&"SHA-512"!==t||!(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");O=80,B=2,Z=e,D=R,G=x,_=k,F=P,I=y,Y=H,N=T,K=E,j=p,V=X}for(o=n[0],i=n[1],h=n[2],w=n[3],u=n[4],d=n[5],l=n[6],f=n[7],g=0;g<O;g+=1)g<16?(Q=g*B,z=r.length<=Q?0:r[Q],J=r.length<=Q+1?0:r[Q+1],W[g]=new Z(z,J)):W[g]=G(I(W[g-2]),W[g-7],F(W[g-15]),W[g-16]),a=_(f,N(u),j(u,d,l),V[g],W[g]),s=D(Y(o),K(o,i,h)),f=l,l=d,d=u,u=D(w,a),w=h,h=i,i=o,o=D(a,s);return n[0]=D(o,n[0]),n[1]=D(i,n[1]),n[2]=D(h,n[2]),n[3]=D(w,n[3]),n[4]=D(u,n[4]),n[5]=D(d,n[5]),n[6]=D(l,n[6]),n[7]=D(f,n[7]),n}6&SUPPORTED_ALGS&&(M=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],4&SUPPORTED_ALGS&&(X=[new e(M[0],3609767458),new e(M[1],602891725),new e(M[2],3964484399),new e(M[3],2173295548),new e(M[4],4081628472),new e(M[5],3053834265),new e(M[6],2937671579),new e(M[7],3664609560),new e(M[8],2734883394),new e(M[9],1164996542),new e(M[10],1323610764),new e(M[11],3590304994),new e(M[12],4068182383),new e(M[13],991336113),new e(M[14],633803317),new e(M[15],3479774868),new e(M[16],2666613458),new e(M[17],944711139),new e(M[18],2341262773),new e(M[19],2007800933),new e(M[20],1495990901),new e(M[21],1856431235),new e(M[22],3175218132),new e(M[23],2198950837),new e(M[24],3999719339),new e(M[25],766784016),new e(M[26],2566594879),new e(M[27],3203337956),new e(M[28],1034457026),new e(M[29],2466948901),new e(M[30],3758326383),new e(M[31],168717936),new e(M[32],1188179964),new e(M[33],1546045734),new e(M[34],1522805485),new e(M[35],2643833823),new e(M[36],2343527390),new e(M[37],1014477480),new e(M[38],1206759142),new e(M[39],344077627),new e(M[40],1290863460),new e(M[41],3158454273),new e(M[42],3505952657),new e(M[43],106217008),new e(M[44],3606008344),new e(M[45],1432725776),new e(M[46],1467031594),new e(M[47],851169720),new e(M[48],3100823752),new e(M[49],1363258195),new e(M[50],3750685593),new e(M[51],3785050280),new e(M[52],3318307427),new e(M[53],3812723403),new e(M[54],2003034995),new e(M[55],3602036899),new e(M[56],1575990012),new e(M[57],1125592928),new e(M[58],2716904306),new e(M[59],442776044),new e(M[60],593698344),new e(M[61],3733110249),new e(M[62],2999351573),new e(M[63],3815920427),new e(3391569614,3928383900),new e(3515267271,566280711),new e(3940187606,3454069534),new e(4118630271,4000239992),new e(116418474,1914138554),new e(174292421,2731055270),new e(289380356,3203993006),new e(460393269,320620315),new e(685471733,587496836),new e(852142971,1086792851),new e(1017036298,365543100),new e(1126000580,2618297676),new e(1288033470,3409855158),new e(1501505948,4234509866),new e(1607167915,987167468),new e(1816402316,1246189591)]));var F=function(r,e,n){var t,o,l,f,a,s,O,g,c,p=0,S=[],E=0,A=r,H=!1,v=!1,T=[],b=[],P=!1;if(t=(c=n||{}).encoding||"UTF8",g=c.numRounds||1,l=d(e,t),g!==parseInt(g,10)||1>g)throw new Error("numRounds must a integer >= 1");if("SHA-1"===A&&1&SUPPORTED_ALGS)a=512,s=D,O=G,f=160;else if(6&SUPPORTED_ALGS&&(s=function(r,e){return _(r,e,A)},O=function(r,e,n,t){return function(r,e,n,t,o){var i,h,w,u,d;if(("SHA-224"===o||"SHA-256"===o)&&2&SUPPORTED_ALGS)w=15+(e+65>>>9<<4),d=16;else{if("SHA-384"!==o&&"SHA-512"!==o||!(4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");w=31+(e+129>>>10<<5),d=32}for(;r.length<=w;)r.push(0);for(r[e>>>5]|=128<<24-e%32,r[w]=e+n,h=r.length,i=0;i<h;i+=d)t=_(r.slice(i,i+d),t,o);if("SHA-224"===o&&2&SUPPORTED_ALGS)u=[t[0],t[1],t[2],t[3],t[4],t[5],t[6]];else if("SHA-256"===o&&2&SUPPORTED_ALGS)u=t;else if("SHA-384"===o&&4&SUPPORTED_ALGS)u=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder];else{if(!("SHA-512"===o&&4&SUPPORTED_ALGS))throw new Error("Unexpected error in SHA-2 implementation");u=[t[0].highOrder,t[0].lowOrder,t[1].highOrder,t[1].lowOrder,t[2].highOrder,t[2].lowOrder,t[3].highOrder,t[3].lowOrder,t[4].highOrder,t[4].lowOrder,t[5].highOrder,t[5].lowOrder,t[6].highOrder,t[6].lowOrder,t[7].highOrder,t[7].lowOrder]}return u}(r,e,n,t,A)}),"SHA-224"===A&&2&SUPPORTED_ALGS)a=512,f=224;else if("SHA-256"===A&&2&SUPPORTED_ALGS)a=512,f=256;else if("SHA-384"===A&&4&SUPPORTED_ALGS)a=1024,f=384;else{if(!("SHA-512"===A&&4&SUPPORTED_ALGS))throw new Error("Chosen SHA variant is not supported");a=1024,f=512}o=B(A),this.setHMACKey=function(r,e,n){var i,h,w,u,l,f;if(!0===v)throw new Error("HMAC key already set");if(!0===H)throw new Error("Cannot set HMAC key after finalizing hash");if(!0===P)throw new Error("Cannot set HMAC key after calling update");if(h=(i=d(e,t=(n||{}).encoding||"UTF8")(r)).binLen,w=i.value,f=(u=a>>>3)/4-1,u<h/8){for(w=O(w,h,0,B(A));w.length<=f;)w.push(0);w[f]&=4294967040}else if(u>h/8){for(;w.length<=f;)w.push(0);w[f]&=4294967040}for(l=0;l<=f;l+=1)T[l]=909522486^w[l],b[l]=1549556828^w[l];o=s(T,o),p=a,v=!0},this.update=function(r){var e,n,t,i,h,w=0,u=a>>>5;for(n=(e=l(r,S,E)).binLen,i=e.value,t=n>>>5,h=0;h<t;h+=u)w+a<=n&&(o=s(i.slice(h,h+u),o),w+=a);p+=w,S=i.slice(w>>>5),E=n%a,P=!0},this.getHash=function(r,e){var n,t,d;if(!0===v)throw new Error("Cannot call getHash after setting HMAC key");switch(d=u(e),r){case"HEX":n=function(r){return i(r,d)};break;case"B64":n=function(r){return h(r,d)};break;case"BYTES":n=w;break;default:throw new Error("format must be HEX, B64, or BYTES")}if(!1===H)for(o=O(S,E,p,o),t=1;t<g;t+=1)o=O(o,f,0,B(A));return H=!0,n(o)},this.getHMAC=function(r,e){var n,t,d;if(!1===v)throw new Error("Cannot call getHMAC without first setting HMAC key");switch(d=u(e),r){case"HEX":n=function(r){return i(r,d)};break;case"B64":n=function(r){return h(r,d)};break;case"BYTES":n=w;break;default:throw new Error("outputFormat must be HEX, B64, or BYTES")}return!1===H&&(t=O(S,E,p,o),o=s(b,B(A)),o=O(t,f,a,o)),H=!0,n(o)}};"function"==typeof define&&define.amd?define(function(){return F}):"undefined"!=typeof exports?"undefined"!=typeof module&&module.exports?module.exports=exports=F:exports=F:r.jsSHA=F}(this);