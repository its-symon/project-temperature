from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, status
from sqlalchemy.orm import Session
from app.services.connection_manager import manager
from app.dependencies import get_current_user
from app.db import get_db

router = APIRouter()

@router.websocket("/ws/temperature")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    token = websocket.query_params.get("token")
    
    if not token or not token.startswith("Bearer "):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    token = token.replace("Bearer ", "")
    user = get_current_user(token, db)

    if not user:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
