export interface TrackInterface {
  // id: number;
  title: string;
  // user: Object;
  // createdAt: Date;
  fileName: string;
}

export interface Track {
  userId: string;
  _id: string;
  title: string;
  createdAt: Date;
  fileName: string;
  thumbnail?: string;

}