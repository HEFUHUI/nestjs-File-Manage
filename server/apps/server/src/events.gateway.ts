import {  OnGatewayConnection, WebSocketGateway,WebSocketServer, WsResponse, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Socket ,Server} from 'socket.io';
import { JsonWebTokenError} from "jsonwebtoken"
import { AppService } from "./app.service";

@WebSocketGateway({path:'/web'})
export class EventsGateway implements OnGatewayConnection,OnGatewayDisconnect,OnGatewayInit{
  constructor(private service:AppService){}
  afterInit(server: any) {}

  handleDisconnect(client:Socket) {
    this.service.offline(client.id);
  }

  handleConnection(client:Socket) {
    this.service.checkToken(this.service.getToken(client.request.url as string)).then((payload:any)=>{
      this.service.online(payload.id,client.id);
    }).catch((err:JsonWebTokenError)=>{
      console.log(err.message)
    })
  }

  @WebSocketServer() server:Server
}