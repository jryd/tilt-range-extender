# Tilt Rebroadcaster

This is a fairly simple Node.js application that can run on a device capable of using Bluetooth to send and receive data.

It helps to solve the common problem where [Tilt Hydrometers](https://tilthydrometer.com/) have a poor range when placed inside heavy walled fermenters. Like the double-walled stainless steel fermenters from Grainfather.

This script will listen for Tilt readings being broadcast from your Tilt and rebroadcast the reading.

It is capable of working with the full range of Tilt devices and listens for all readings at once, this means it isn't isolated to one Tilt at a time like the office Tilt range extender.

It does this by listening for all BLE Bleacon calls, and if the UUID is a Tilt device then we push the reading to an in-memory queue to be rebroadcast.
Due to the short time frequency required for each broadcast (~200ms) we can easily support readings from all the current Tilt devices, even if they are all broadcasting at once.