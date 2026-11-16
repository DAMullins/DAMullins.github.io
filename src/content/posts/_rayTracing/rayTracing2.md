---
author: David Andrew Mullins
pubDatetime: 2026-09-17T16:54:00Z
modDatetime: 
title: "Ray Tracing in One Weekend: Part 2"
slug: ray-tracing-part-2
featured: true
draft: true
tags:
  - ray-tracing
  - cpp
  - ray-tracing-in-one-weekend
description: "Develop of point3 and color classes. Render output of a sphere in 3d space."
---

## Overview

In the previous post, I detailed the development of the project setup and one of the fundamental classes used in the ray tracer, the vector 3. In this post, I will be expanding the vector3 class with 2 other classes, point3 and color.

## Coding Progress
From the last post, I realized that my version of the code seems to have a lot more boilerplate in it that may seem unnecessary. I do not think that I did a good job in explaining my reasoning then, so I will try to reiterate that now. 

My intent with the `[[nodiscard]]` tag is to mark functions where it does not make sense to call them without using their value. For example, the `unit_vector` function takes in a vec3 and returns a vec3, but it does not alter the input vector at all. Marking this function with `[[nodiscard]]` will make it so that `unit_vector(v1);` will not compile since the return value was discarded. If you wanted to normalize the vector, you would do `v1 = unit_vector(v1);` instead.

The `constexpr` and `noexcept` allow for compiler optimizations in certain cases. 


### Key Takeaways

## Next Steps
