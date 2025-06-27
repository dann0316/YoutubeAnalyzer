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
require("dotenv").config();
var express = require("express");
var axios = require("axios");
var cors = require("cors");
var app = express();
var PORT = 5000;
app.use(cors());
// ✅ 영상 길이에 따른 예상 시청 지속율 계산 함수
function getEstimatedWatchTimeRate(videoLength) {
    if (videoLength <= 180) {
        // 3분 이하
        return 0.6;
    }
    else if (videoLength <= 600) {
        // 10분 이하
        return 0.5;
    }
    else if (videoLength <= 1200) {
        // 20분 이하
        return 0.4;
    }
    else {
        return 0.3;
    }
}
// ✅ 업로드 시간 가중치 (18시~21시 업로드 시 가산점)
function getUploadTimeBonus(publishedAt) {
    var hour = new Date(publishedAt).getHours();
    return hour >= 18 && hour <= 21 ? 5 : 0;
}
// ✅ 성과도 계산 함수 (Viewtrap 유사 알고리즘 적용)
function calculatePerformanceScore(views, subscribers, daysSincePosted, likes, comments, averageViewDuration, videoLength, title, keyword, publishedAt) {
    var speedScore = Math.min((views / daysSincePosted) * 0.002, 30);
    var retentionRate = (averageViewDuration / videoLength) * 100;
    var retentionScore = Math.min(retentionRate * 0.2, 20);
    var engagementScore = Math.min(((likes + comments * 2) / views) * 100 * 0.2, 20);
    var viewToSubscriberScore = Math.min((views / subscribers) * 20, 20);
    var keywordMatchScore = title.includes(keyword) ? 5 : 0;
    var timeBonus = getUploadTimeBonus(publishedAt);
    return Math.round(speedScore +
        retentionScore +
        engagementScore +
        viewToSubscriberScore +
        keywordMatchScore +
        timeBonus);
}
// ✅ YouTube 영상 검색 API + 성과도 계산
app.get("/api/videos", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, keyword_1, pageToken, API_KEY, searchUrl, searchResponse, filteredItems, videoIds, detailsUrl, detailsResponse_1, videos, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, keyword_1 = _a.keyword, pageToken = _a.pageToken;
                if (!keyword_1) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "검색할 키워드를 입력하세요." })];
                }
                API_KEY = process.env.YOUTUBE_API_KEY;
                searchUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=".concat(encodeURIComponent(keyword_1), "&type=video&maxResults=10&key=").concat(API_KEY, "&pageToken=").concat(pageToken || "");
                return [4 /*yield*/, axios.get(searchUrl)];
            case 1:
                searchResponse = _b.sent();
                filteredItems = searchResponse.data.items.filter(function (item) {
                    return item.snippet.title.includes(keyword_1);
                });
                videoIds = filteredItems.map(function (item) { return item.id.videoId; }).join(",");
                if (!videoIds) {
                    return [2 /*return*/, res.json({
                            videos: [],
                            nextPageToken: searchResponse.data.nextPageToken || null,
                        })];
                }
                detailsUrl = "https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=".concat(videoIds, "&key=").concat(API_KEY);
                return [4 /*yield*/, axios.get(detailsUrl)];
            case 2:
                detailsResponse_1 = _b.sent();
                videos = filteredItems.map(function (item) {
                    var details = detailsResponse_1.data.items.find(function (d) { return d.id === item.id.videoId; });
                    var statistics = (details === null || details === void 0 ? void 0 : details.statistics) || {};
                    var contentDetails = (details === null || details === void 0 ? void 0 : details.contentDetails) || {};
                    var views = parseInt(statistics.viewCount || "0");
                    var likes = parseInt(statistics.likeCount || "0");
                    var comments = parseInt(statistics.commentCount || "0");
                    var videoLength = convertDurationToSeconds(contentDetails.duration || "PT0S");
                    var daysSincePosted = getDaysSincePosted(item.snippet.publishedAt);
                    var estimatedWatchTimeRate = getEstimatedWatchTimeRate(videoLength);
                    var averageViewDuration = videoLength * estimatedWatchTimeRate;
                    var performanceScore = calculatePerformanceScore(views, 10000, daysSincePosted, likes, comments, averageViewDuration, videoLength, item.snippet.title, keyword_1, item.snippet.publishedAt);
                    return {
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail: item.snippet.thumbnails.high.url,
                        publishedAt: item.snippet.publishedAt,
                        channelTitle: item.snippet.channelTitle,
                        views: views,
                        likes: likes,
                        comments: comments,
                        videoLength: videoLength,
                        performanceScore: performanceScore,
                    };
                });
                // 🔹 조회수 기준 정렬
                videos.sort(function (a, b) { return b.views - a.views; });
                res.json({
                    videos: videos,
                    nextPageToken: searchResponse.data.nextPageToken || null,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error("❌ 서버 오류:", error_1);
                res.status(500).json({
                    error: "서버 오류 발생",
                    details: error_1.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ✅ 유튜브 영상 길이 변환 (PnDTnHnMnS → 초)
function convertDurationToSeconds(duration) {
    var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match)
        return 0;
    var hours = match[1] ? parseInt(match[1]) : 0;
    var minutes = match[2] ? parseInt(match[2]) : 0;
    var seconds = match[3] ? parseInt(match[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}
// ✅ 업로드 후 경과 일수 계산
function getDaysSincePosted(publishedAt) {
    var publishedDate = new Date(publishedAt);
    var today = new Date();
    var diffTime = Math.abs(today.getTime() - publishedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
// ✅ 검색 자동완성 API
app.get("/api/autocomplete", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var keyword, suggestUrl, response, suggestions, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                keyword = req.query.keyword;
                if (!keyword) {
                    return [2 /*return*/, res.status(400).json({ error: "검색어를 입력하세요." })];
                }
                suggestUrl = "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=".concat(encodeURIComponent(keyword));
                return [4 /*yield*/, axios.get(suggestUrl)];
            case 1:
                response = _a.sent();
                suggestions = response.data[1] || [];
                res.json({ suggestions: suggestions });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("❌ 자동완성 API 오류:", error_2);
                res.status(500).json({
                    error: "자동완성 데이터를 가져오는 중 오류 발생",
                    details: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ 서버 실행
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 \uC11C\uBC84 \uC2E4\uD589 \uC911: http://localhost:".concat(PORT));
});
