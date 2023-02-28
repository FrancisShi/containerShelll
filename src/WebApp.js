/**
 * 业务接入样例
 */
import { useEffect } from "react";
import App from "@mindverse/container";

export default function Container(props) {
  const refUserId = "shitou";

  return (
    <div style={{ width: "100vw", height: "95vh" }}>
      <App
        sessionCb={(_sessionId) => {}}
        config={{
          mindConfig: {
            mindId: "76643513529405440",
            mindType: "original",
          },
          socketConfig: {
            apiVersion: "1.2.0",
            platform: "Saas",
            appId: "os_742e9fcd-d543-4c99-94d7-404119bea18a",
            bizType: "SAAS",
            merchantId: "c1e3x",
            mAuthType: "SAAS_KEY",

            refUserId,

            merchantBaseURL: "https://test-accessor.mindverse.com",
            merchantSocketPath: "/rest/demo/ws/create",
            merchantSessionOpenPath: "/rest/demo/session/create",
            merchantSessionClosePath: "/rest/demo/session/close",
            merchantUserRegisterPath: "/rest/demo/user/register",
            merchantSocketCheckPath: "/rest/demo/ws/get",
            merchantSessionCheckPath: "/rest/demo/session/get",

            headers: {},
          },
          userConfig: {
            userName: "shitou-demo", // document.getElementById("#nickname").value,
            avatar:
              "https://cdn.mindverse.com/img/zzzz202302211676948571901%E5%BF%83%E8%AF%86%E5%BC%95%E5%AF%BC%E5%91%98.png",
          },
          dynamicHeight: false,
        }}
      />
    </div>
  );
}
