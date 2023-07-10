/**
 * 业务接入样例
 */
import App, { DevelopType } from "@mindverse/container";
import { SocketSessionManager } from '@mindverse/accessor-open';
import Fingerprint2 from "fingerprintjs2"; // 引入fingerprintjs2
import { useEffect, useState, useCallback, memo } from "react";

import request from "./request.js";

function getFinger(callback) {
  // 选择哪些信息作为浏览器指纹生成的依据
  const options = {
    fonts: {
      extendedJsFonts: true,
    },
    excludes: {
      audio: true,
      userAgent: true,
      enumerateDevices: true,
      touchSupport: true,
    },
  };
  // 浏览器指纹
  Fingerprint2.get(options, (components) => {
    // 参数只有回调函数或者options为{}时，默认浏览器指纹依据所有配置信息进行生成
    const values = components.map((component) => component.value); // 配置的值的数组
    const murmur = Fingerprint2.x64hash128(values.join(""), 31); // 生成浏览器指纹
    callback && callback(murmur);
  });
};

function Container() {
  const [refUserId, setRefUserId] = useState("");

  // 解析 URL 对象
  const url = new URL(window.location.href);
  // 取得查询字符串参数
  const params = new URLSearchParams(url.search);

  // 获取指定参数的值
  // const host = params.get("host") || "https://mindos.com/gate";
  const host = "https://mindos.com/gate";
  const merchantId = params.get("merchantId") || "c1dyy";
  const appId =
    params.get("appId") || "os_6749495f-ae3c-4f87-9233-f233d670e3dc";
  const mindId = params.get("mindId") || "97858626479329280";

  const [avatarInfo, setAvatarInfo] = useState({
    mindName: "",
    avatar: "",
    model: "",
    type: "",
    gender: "",
  });

  const setDefault = useCallback(() => {
    console.error("url params error, go default");
    setAvatarInfo({
      mindName: "Angela",
      avatar:
        "https://cdn.mindverse.ai/mindos-resource/front-img/img/zzzz202304111681207263197%E5%A5%B38.png",
      model: "",
      type: "pictureModel",
    });
  }, []);

  useEffect(() => {
    if (host && merchantId && appId && mindId) {
      request({
        baseURL: host,
        url: "/chat/rest/general/mind/get/config/by/mind",
        method: "post",
        data: { mindId },
        headers: {
          "M-AuthType": "STATION_KEY",
          merchantId,
          platform: "web",
          appId,
        },
      })
        .then((res) => {
          if (res.data?.code === 0 && res.data?.data) {
            setAvatarInfo({
              avatar: res.data.data.avatarInfo?.avatar,
              model: res.data.data.avatarInfo?.model,
              type: res.data.data.avatarInfo.type,
              mindName: res.data.data.mindName,
              gender: res.data.data.avatarInfo?.gender,
            });
          } else {
            setDefault();
          }
        })
        .catch((e) => {
          setDefault();
        });
    } else {
      setDefault();
    }
  }, []);

  useEffect(() => {
    if (localStorage) {
      console.log("OK localStorage.");
      const browserId = localStorage.getItem("browserId");
      if (browserId) {
        setRefUserId(browserId);
      } else {
        getFinger((finger) => {
          localStorage.setItem("browserId", finger);
          setRefUserId(finger);
        });
      }
    } else {
      console.error("No localStorage.");
      getFinger((finger) => {
        setRefUserId(finger);
      });
    }
  }, []);

  useEffect(() => {
    const uniqueClassName = "hidden-scrollbar";

    if (!document.querySelector(`.${uniqueClassName}`)) {
      const style = document.createElement("style");
      style.innerHTML = `
        .${uniqueClassName}::-webkit-scrollbar {
          width: 0;
          height: 0;
          background: none;
          display: none;
        }
      `;
      document.head.appendChild(style);
      const element = document.getElementsByTagName(`body`);
      element[0].classList.add(uniqueClassName);
    }
  }, []);

  if (
    refUserId &&
    avatarInfo &&
    (avatarInfo.avatar || avatarInfo.model) &&
    avatarInfo.mindName
  ) {
    return (
      <div style={{ width: "100vw", height: "100vh" }}>
        <App
          inIframe
          appMode="WIDGET"
          config={{
            mindConfig: {
              mindId,
              mindType: "original",
            },
            sessionManager: new SocketSessionManager({
              config: {
                baseURL: host,
                requestHeader: {
                  platform: 'web',
                  appId,
                  bizType: '',
                  merchantId,
                  'M-AuthType': 'STATION_KEY'
                },
                refUserId,
                APIVersion: '1.3.0',
      
                socketURLConfig: {
                  socketPath: '/chat/rest/general/ws/create',
                  socketCheckPath: '/chat/rest/general/ws/get'
                },
                sessionURLConfig: {
                  openPath: '/chat/rest/general/session/create',
                  closePath: '/chat/rest/general/session/close',
                  checkPath: '/chat/rest/general/session/get'
                },
                sessionConnectConfig: {
                  deviceId: 'deviceId'
                }
              }
            }),
            refUserId,
            initialExpand: false,
            userConfig: {
              // userName: avatarInfo.mindName,
              userName: "Anonymous User", // 独立站初始设置为匿名
              picture: avatarInfo.avatar,
              model: avatarInfo.model,
              type: avatarInfo.type,
              gender: avatarInfo.gender,
            },
            developType: DevelopType.SCRIPT
          }}
        />
      </div>
    );
  } else {
    return null;
  }
}

export default memo(Container);
