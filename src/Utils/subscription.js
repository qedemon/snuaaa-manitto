import dataConnect from "../Connections/NovaConnection";

export function getAbleToSubscribe(){
    return navigator.serviceWorker;
}

export async function getSubscription(){
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager?.getSubscription();
}

export async function subscribe() {
    async function postSubscription(userInfo, subscription) {
        return (
        await dataConnect.post("/push/registerPush", {
            user_id: userInfo.user_id,
            subscription,
        })
        ).data;
    }
    try {
        if (!("serviceWorker" in navigator)) {
            throw new Error("serviceWorker not impelemented");
            }
            const vapidKey = await (async () => {
                const { result, error, key } = (
                    await dataConnect.get("/push/getVAPIDKey")
                ).data;
                if (result !== 0) {
                    throw error;
                }
                return key.public;
            })();
            const userInfo = await (async () => {
                const { result, error, origin, userInfo } = (
                    await dataConnect.get("/user/whoami")
                ).data;
                if (result !== 0) {
                    throw error;
                }
                if (origin !== "local") {
                    throw new Error("unregisterd user");
                }
                return userInfo;
            })();

            /*const permission = await Notification.requestPermission();
            if(permission === "denied"){
                throw new Error("permission denied");
            }*/

            if (navigator.serviceWorker) {
            await navigator.serviceWorker.register(`serviceworker.js`);
            const registration = await navigator.serviceWorker.ready;

            const pushSubscription =
                (await registration.pushManager.getSubscription()) ||
                (await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey,
                }));

            await (async () => {
                const { error /*, user*/ } = await postSubscription(
                userInfo,
                pushSubscription
                );
                if (error) {
                throw error;
                }
            })();
            return {subscription: pushSubscription};
        }
    } catch (error) {
        return {
            error: new Error ("알람 설정 도중 에러가 발생하였습니다.")
        }
    }
}

export async function unsubscribe(subscription){
    if (subscription) {
        return await subscription.unsubscribe();
    }
}