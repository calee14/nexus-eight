"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retireNexus8 = retireNexus8;
exports.retireNexus6 = retireNexus6;
exports.retireNexus9 = retireNexus9;
exports.retireNexus4 = retireNexus4;
var axios_1 = require("axios");
var cheerio = require("cheerio");
/*
 * returns recent price-earnings-growth ratio
 * */
function retireNexus8(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, $_1, dateTds, periods, targetTds, pegRatios_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    url = "https://stockanalysis.com/stocks/".concat(ticker.toLowerCase(), "/financials/ratios/?p=quarterly");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_1 = cheerio.load(data);
                    dateTds = $_1('div').filter(function () {
                        return $_1(this).text().trim() === "Period Ending";
                    }).parent().siblings();
                    periods = dateTds.toArray()
                        .map(function (ele) { return $_1(ele).text(); });
                    targetTds = $_1('div').filter(function () {
                        return $_1(this).text().trim() === "PEG Ratio";
                    }).parent().siblings();
                    pegRatios_1 = targetTds.toArray()
                        .map(function (ele) { return parseFloat($_1(ele).text()); })
                        .filter(function (num) { return !Number.isNaN(num); });
                    periods.splice(pegRatios_1.length);
                    if (periods.length === pegRatios_1.length) {
                        console.log(periods.map(function (period, i) { return [period, pegRatios_1[i]]; }));
                        return [2 /*return*/, periods.map(function (period, i) { return [period, pegRatios_1[i]]; })];
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error fetching or parsing the page:', error_1);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*
 * returns recent growth rates
 * */
function retireNexus6(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, $_2, dateTds, periods, targetTds, revGrowth_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "https://stockanalysis.com/stocks/".concat(ticker.toLowerCase(), "/financials/?p=quarterly");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_2 = cheerio.load(data);
                    dateTds = $_2('div').filter(function () {
                        return $_2(this).text().trim() === "Period Ending";
                    }).parent().siblings();
                    periods = dateTds.toArray()
                        .map(function (ele) { return $_2(ele).text(); });
                    targetTds = $_2('div').filter(function () {
                        return $_2(this).text().trim() === "Revenue Growth (YoY)";
                    }).parent().siblings();
                    revGrowth_1 = targetTds.toArray()
                        .map(function (ele) { return parseFloat($_2(ele).text()); })
                        .filter(function (num) { return !Number.isNaN(num); });
                    periods.splice(revGrowth_1.length);
                    if (periods.length === revGrowth_1.length) {
                        return [2 /*return*/, periods.map(function (period, i) { return [period, revGrowth_1[i]]; })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error fetching or parsing the page:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/*
 * returns recent p/fcf rates
 * */
function retireNexus9(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, $_3, dateTds, periods, targetTds, fcfRatios_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "https://stockanalysis.com/stocks/".concat(ticker.toLowerCase(), "/financials/ratios/?p=quarterly");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_3 = cheerio.load(data);
                    dateTds = $_3('div').filter(function () {
                        return $_3(this).text().trim() === "Period Ending";
                    }).parent().siblings();
                    periods = dateTds.toArray()
                        .map(function (ele) { return $_3(ele).text(); });
                    targetTds = $_3('div').filter(function () {
                        return $_3(this).text().trim() === "P/FCF Ratio";
                    }).parent().siblings();
                    fcfRatios_1 = targetTds.toArray()
                        .map(function (ele) { return parseFloat($_3(ele).text()); })
                        .filter(function (num) { return !Number.isNaN(num); });
                    periods.splice(fcfRatios_1.length);
                    if (periods.length === fcfRatios_1.length) {
                        return [2 /*return*/, periods.map(function (period, i) { return [period, fcfRatios_1[i]]; })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error fetching or parsing the page:', error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/*
 * returns recent p/s rates
 * */
function retireNexus4(ticker) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, $_4, dateTds, periods, targetTds, fcfRatios_2, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    url = "https://stockanalysis.com/stocks/".concat(ticker.toLowerCase(), "/financials/ratios/?p=quarterly");
                    return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    data = (_a.sent()).data;
                    $_4 = cheerio.load(data);
                    dateTds = $_4('div').filter(function () {
                        return $_4(this).text().trim() === "Period Ending";
                    }).parent().siblings();
                    periods = dateTds.toArray()
                        .map(function (ele) { return $_4(ele).text(); });
                    targetTds = $_4('div').filter(function () {
                        return $_4(this).text().trim() === "PS Ratio";
                    }).parent().siblings();
                    fcfRatios_2 = targetTds.toArray()
                        .map(function (ele) { return parseFloat($_4(ele).text()); })
                        .filter(function (num) { return !Number.isNaN(num); });
                    periods.splice(fcfRatios_2.length);
                    if (periods.length === fcfRatios_2.length) {
                        return [2 /*return*/, periods.map(function (period, i) { return [period, fcfRatios_2[i]]; })];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error fetching or parsing the page:', error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Replace with the URL you want to scrape
retireNexus8('CRWD');
// retireNexus6('CRWD');
// retireNexus9('CRWD');
// retireNexus4('CRWD');
