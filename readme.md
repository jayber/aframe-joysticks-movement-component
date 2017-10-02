This component is a straight up copy of Don McCurdy's gamepad component: https://github.com/donmccurdy/aframe-gamepad-controls
with 2 significant additions

1. The movement vector factors in the position of the hmd if present, so that forward is always the direction
you are looking.

1. Right stick rotation works for tracked controllers by making the "right stick" equal the stick connected to the second
controller - rotation is quantized for oculus and vive, rather than smooth, to reduce motion sickness.

BUGS: right stick rotation seems to jump the first time it is used

Only been tested with a gamepad and oculus touch, vive support untested.