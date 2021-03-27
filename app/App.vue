<template>
  <div class="row">
    <div style="display: flex">
      <img width="80px" :src="avatar" />
      <h1>{{ name }}</h1>
    </div>
    <p>简介：{{ description }}</p>
    <div>
      <small>关注：{{ followCount }}</small>
      <small style="margin: 0 10px">粉丝：{{ followersCount }}</small>
      <small>微博：{{ statusesCount }}</small>
    </div>
    <div style="display: flex; margin: 30px 0">
      <div style="width: 50%">
        <ve-pie
          :data="chartData"
          :resizeable="true"
          :settings="chartSettings"
        ></ve-pie>
      </div>
      <div style="width: 50%">
        <ve-pie
          :data="chartDat2"
          :resizeable="true"
          :settings="chartSettings"
        ></ve-pie>
      </div>
    </div>
    <div
      v-for="item in posts"
      :key="item.id"
      style="
        margin: 10px 0;
        background-color: #eee;
        padding: 10px;
        word-break: break-all;
      "
    >
      <h4 style="margin: 0">
        类型：{{ item.retweetId ? "转发" : "原创" }} - 时间：{{
          item.createdAt
        }}
      </h4>
      <p>内容：{{ item.text }}</p>
      <p>文章链接：{{ item.articleUrl ? item.articleUrl : "-" }}</p>
      <p>话题：{{ item.topics ? item.topics : "-" }}</p>
      <p>@：{{ item.atUsers ? item.atUsers : "-" }}</p>
      <p v-if="item.pics">
        图片：<a
          :href="pic"
          target="_blank"
          v-for="pic in item.pics.split(',')"
          :key="pic"
          >{{ pic }}</a
        >
      </p>
      <p v-else>图片：-</p>
      <p>视频链接：{{ item.videoUrl ? item.videoUrl : "-" }}</p>
      <div>
        <small>转发：{{ item.repostsCount }}</small>
        <small style="margin: 0 10px">评论：{{ item.commentsCount }}</small>
        <small>赞：{{ item.attitudesCount }}</small>
      </div>
      <ve-histogram
        :data="{
          columns: ['日期', '转发', '评论', '赞'],
          rows: [
            {
              日期: item.createdAt,
              转发: item.repostsCount,
              评论: item.commentsCount,
              赞: item.attitudesCount,
            },
          ],
        }"
      ></ve-histogram>
    </div>
  </div>
</template>

<style scoped>
.row {
  margin: 10px 30px;
}
</style>

<script>
import axios from "axios";
import VePie from "v-charts/lib/pie";
import VeHistogram from "v-charts/lib/histogram";

export default {
  name: "Demo",
  components: { VePie, VeHistogram },
  data: function () {
    return {
      avatar:
        "https://tvax2.sinaimg.cn/crop.0.0.1006.1006.180/781f4a97ly8gdi6dzcdnsj20ry0ryt9e.jpg?KID=imgbed,tva&Expires=1616838655&ssig=udD6JZ9Bzc",
      name: "广东天气",
      statusesCount: 0,
      followersCount: 0,
      followCount: 0,
      description:
        "天气信息、应急信息、预警信息发布的平台，气象科普的园地，百姓生活的参考，与公众沟通互动的桥梁。",
      posts: [
        {
          id: 0,
          screenName: "",
          text:
            "来，到广东请你吃雪条//@云南气象:#全国气温霸屏排行榜#今天又是我们南兄南弟霸榜的一天~",
          articleUrl: "",
          topics: "",
          atUsers: "",
          pics: "",
          videoUrl: "",
          createdAt: "",
          attitudesCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          retweetId: "",
        },
      ],
      chartSettings: { type: "pie" },
      chartData: {
        columns: ["key", "value"],
        rows: [
          {
            key: "原创",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "转发",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
        ],
      },
      chartDat2: {
        columns: ["key", "value"],
        rows: [
          {
            key: "纯文字",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "带图片",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "带视频",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      axios.get(`http://localhost:3000/posts`).then((json) => {
        var data = json.data.data;
        var user = data["user"][0];
        var posts = [];
        var rows = [
          {
            key: "原创",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "转发",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
        ];
        var rows2 = [
          {
            key: "纯文字",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "带图片",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
          {
            key: "带视频",
            value: 0, //  8% X  只能传入number  8% 不识别
          },
        ];
        data["posts"].forEach((value) => {
          if (value.retweet_id) {
            rows[1]["value"] += 1;
          } else {
            rows[0]["value"] += 1;
          }
          if (value.pics) {
            rows2[1]["value"] += 1;
          } else if (value.video_url) {
            rows2[2]["value"] += 1;
          } else {
            rows2[0]["value"] += 1;
          }
          posts.push({
            id: value.id,
            screenName: "",
            text: value.text,
            articleUrl: value.article_url,
            topics: value.topics,
            atUsers: value.at_users,
            pics: value.pics,
            videoUrl: value.video_url,
            createdAt: value.created_at,
            attitudesCount: value.attitudes_count,
            commentsCount: value.comments_count,
            repostsCount: value.reposts_count,
            retweetId: value.retweet_id,
          });
        });
        this.avatar = user.profile_image_url;
        this.name = user.screen_name;
        this.statusesCount = user.statuses_count;
        this.followersCount = user.followers_count;
        this.followCount = user.follow_count;
        this.description = user.description;
        this.chartData.rows = rows;
        this.chartDat2.rows = rows2;
        this.posts = posts;
      });
    },
  },
};
</script>