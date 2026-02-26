import {Request,Response}from 'express';

export const ExampleFn = (req:Request, res:Response) =>
{
  res.json({ message: "Hello from the Backend!" });
};