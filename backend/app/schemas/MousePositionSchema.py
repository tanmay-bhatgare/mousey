from pydantic import BaseModel


class MousePositionSchema(BaseModel):
    type: str
    x: float
    y: float
