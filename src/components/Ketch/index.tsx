import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

const Ketch = (): ReactElement => {
  return (
    <Helmet>
      <script>
        {`
            !(function () {
              (window.semaphore = window.semaphore || []),
                (window.ketch = function () {
                  window.semaphore.push(arguments);
                });
              var e = new URLSearchParams(document.location.search),
                o = e.has("property") ? e.get("property") : "website_smart_tag",
                n = document.createElement("script");
              (n.type = "text/javascript"),
                (n.src = "https://global.ketchcdn.com/web/v2/config/jbtc/".concat(
                  o,
                  "/boot.js"
                )),
                (n.defer = n.async = !0),
                document.getElementsByTagName("head")[0].appendChild(n);
            })();
          `}
      </script>
      <script>
        {`window.semaphore = window.semaphore || [];
              window.semaphore.push(["onConsent"]);
            `}
      </script>
    </Helmet>
  );
};
export default Ketch;
