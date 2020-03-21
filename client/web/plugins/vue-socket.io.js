import Vue from "vue"
import VueSocketIO from "vue-socket.io"

const io = new VueSocketIO({
    debug: true,
    connection:
    localStorage.getItem("auth._token.local") ? process.env.BaseUrl+`?token=${localStorage.getItem("auth._token.local").split(" ").pop()}` : process.env.BaseUrl,
    options: { path: "/web" }
})

Vue.use(io);
export default io;