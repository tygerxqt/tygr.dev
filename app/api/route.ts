export async function GET(request: Request) {
    return new Response(`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>tygr.dev API Docs</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=JetBrains+Mono">
    </head>

    <body style="margin: 0; padding: 0; font-family: 'JetBrains Mono'; background: #111; color: #fff;">
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; height: auto; margin-bottom: 1rem;">
        <div style="height: 100%; align-items: center; justify-content: center; max-width: 1400px; margin: 1.5rem; padding: 1.5rem;">
            <h1 style="font-weight: 900; font-size: 48px;">
                tygr.dev API Docs
            </h1>

            <p>
                This API is intented to be used by <a href="/">tygr.dev</a>, however, it is open to the public for anyone to use if they wish.
            </p>

            <ul style="text-align: left;">
                <li>All endpoints use GET methods.</li>
                <li>If you are intentionally abusing the API, your IP will be blacklisted. To prevent false positives, contact me about excessive use.</li>
                <li>Some endpoints requre authentication. Tokens will <b>not</b> be given out and will only be used in projects affiliated with me.</li>
            </ul>

            <div style="padding-top: 1rem;">
                <div>
                    <h2 style="margin: 0;">~/notion</h2>
                    <p style="margin: 0; color: #888;">A full list of endpoints for Notion data. <b>Authentication required</b>.</p>
                </div>
                <ul style="list-style-type: none;">
                    <li style="border: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem; padding-right: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.05);">
                        <div style="font-family: JetBrains Mono;">
                            <p>
                                &gt; /api/notion/image/:id - Get a Notion image by its ID, cached for an hour. <a target="_blank" href="https://developers.notion.com/docs/working-with-files-and-media#retrieving-files-or-media-via-the-notion-api:~:text=Since%20the%20public%20URLs%20expire%20hourly%2C%20they%20shouldn%E2%80%99t%20be%20statically%20referenced.%20If%20the%20public%20URL%20is%20directly%20referenced%2C%20the%20file%20will%20not%20be%20accessible%20at%20that%20URL%20after%20the%20expiration%20time%20is%20reached%20and%20a%20new%20URL%20must%20be%20retrieved%20via%20the%20Notion%20API.">(Why?)</a>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>

            <div style="padding-top: 1rem;">
                <div>
                    <h2 style="margin: 0;">~/spotify</h2>
                    <p style="margin: 0; color: #888;">A full list of endpoints for Spotify data.</p>
                </div>
                <ul style="list-style-type: none;">
                    <li style="border: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem; padding-right: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.05);">
                        <div style="font-family: JetBrains Mono;">
                            <p>
                                &gt; /api/spotify/status - Get my current Spotify status (Now playing). 
                            </p>
                        </div>
                    </li>

                    <li style="border: 1px solid rgba(255, 255, 255, 0.1); padding-left: 1rem; padding-right: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; background: rgba(255, 255, 255, 0.05);">
                        <div style="font-family: JetBrains Mono;">
                            <p>
                                &gt; /api/spotify/top - Get 15 of my most listened Spotify tracks. 
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </body>
</html>`, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        }
    });
}