import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, of } from 'rxjs';

let num = 0;


@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('events')
  onEvent(client: any, payload: any): Observable<WsResponse<any>> {
    num++
    console.log(`有一位用户链接!> ${num}`);
    client.on('disconnect', () => {
      num--
      console.log(`有人离开了...> ${num}`);
    })
    return of({event:"hello",data:"sadasd"})
    // return of({ event: 'message', data: '233' });
  }
}
