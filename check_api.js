const base = 'https://dramabos.asia/api/radreel';

async function run() {
    try {
        const detail = await fetch(`${base}/api/v1/drama/VYmk`).then(r => r.json());
        console.log('DETAIL_COVER:', detail.coverImgUrl);
        console.log('DETAIL_SUMMARY:', detail.introduce);

        const episodes = await fetch(`${base}/api/v1/episodes/VYmk`).then(r => r.json());
        console.log('EPISODES_IS_ARRAY:', Array.isArray(episodes));
        if (Array.isArray(episodes)) console.log('EP_0:', JSON.stringify(episodes[0]));

        const play = await fetch(`${base}/api/v1/play/VYmk?seq=1`).then(r => r.json());
        console.log('PLAY_RES:', JSON.stringify(play));
    } catch (e) { console.error(e); }
}
run();
