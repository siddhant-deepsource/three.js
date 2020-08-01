/**
 * @author mrdoob / http://mrdoob.com/
 */

import { CubeReflectionMapping, CubeRefractionMapping, EquirectangularReflectionMapping, EquirectangularRefractionMapping } from '../../constants.js';
import { WebGLCubeRenderTarget } from "../WebGLCubeRenderTarget.js";

function WebGLCubeMaps( renderer ) {

	let cubemaps = new WeakMap();

	function mapTextureMapping( texture, mapping ) {

		if ( mapping === EquirectangularReflectionMapping ) {

			texture.mapping = CubeReflectionMapping;

		} else if ( mapping === EquirectangularRefractionMapping ) {

			texture.mapping = CubeRefractionMapping;

		}

		return texture;

	}

	function get( texture ) {

		if ( texture && texture.isTexture ) {

			const mapping = texture.mapping;

			if ( mapping === EquirectangularReflectionMapping || mapping === EquirectangularRefractionMapping ) {

				if ( cubemaps.has( texture ) ) {

					const cubemap = cubemaps.get( texture ).texture;
					return mapTextureMapping( cubemap, texture.mapping );

				} else {

					const image = texture.image;

					if ( texture.isDataTexture === true || image.complete === true ) {

						const renderTarget = new WebGLCubeRenderTarget( image.height / 2 );
						renderTarget.fromEquirectangularTexture( renderer, texture );
						cubemaps.set( texture, renderTarget );

						return mapTextureMapping( renderTarget.texture, texture.mapping );

					}

				}

			}

		}

		return texture;

	}

	function dispose() {

		cubemaps = new WeakMap();

	}

	return {
		get: get,
		dispose: dispose
	};

}

export { WebGLCubeMaps };
