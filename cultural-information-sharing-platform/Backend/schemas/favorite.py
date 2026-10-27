from pydantic import BaseModel


class FavoriteCreate(BaseModel):
    user_id: int
    cultural_id: int
