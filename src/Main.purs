module Main where

import Prelude

import Color (graytone, hsl)
import Data.Foldable (maximum)
import Data.Int (toNumber)
import Data.Maybe (fromJust)
import Effect (Effect)
import Math ((%))
import P5.Canvas (background, createCanvas, fill, noStroke)
import P5.D2 (circle)
import P5.Environment (frameCount, size)
import P5.Monad (draw, runP5, setup)
import Partial.Unsafe (unsafePartial)

main :: Effect Unit
main = runP5 do
  setup do
    createCanvas 400 400
  draw do
    f <- toNumber <$> frameCount
    s <- (map toNumber) <$> size
    let col = hsl (f % 360.0) 0.4 0.5
        center = map ((*) 0.5) s
        r = (unsafePartial fromJust $ maximum s) * 0.8
    background $ graytone (51.0/255.0)
    noStroke
    fill col
    circle center r