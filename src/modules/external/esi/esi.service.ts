import { Component } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { CacheService } from '../../cache/cache.service';
import {
  AllianceName, CharacterName, CorporationName, GetCharacter,
  Search,
} from './esi.interface';
import { Character } from '../../character/character.entety';
import { Corporation } from '../../corporation/corporation.entety';
import { Alliance } from '../../alliance/alliance.entety';

@Component()
export class ESIService {

  private baseUrl = 'https://esi.tech.ccp.is/latest/';
  private userAgent = `eve-book/${process.env.npm_package_version} https://github.com/evebook/api`;
  private client: AxiosInstance;

  constructor(private cacheService: CacheService) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'User-Agent': this.userAgent,
        Accept: 'application/json',
      },
    });
  }

  /**
   * Request wrapper, it stores response to cache and use it if it's not expired
   * @param config
   * @return {Promise<T>}
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const hash = await this.cacheService.hash(config);

    if (await this.cacheService.exsists(hash)) {
      return this.cacheService.fetch<T>(hash);
    }

    try {
      const response = await this.client.request(config);
      const cacheTime = parseInt(response.headers['access-control-max-age']);

      await this.cacheService.store(hash, response.data, cacheTime);

      return response.data;
    }catch (err) { console.log(err)}

  }

  /**
   * Search for alliances, characters, corporations
   * @param query
   * @return {Promise<Search>}
   */
  public async search(query: string): Promise<Search> {
    return this.request<Search>({
      url: 'search/',
      method: 'GET',
      params: {
        categories: ['alliance', 'character', 'corporation'].join(','),
        search: query,
      },
    });
  }

  /**
   * Get character names for ids
   * @param ids
   * @return {Promise<CharacterName>}
   */
  public async characterNames(ids: number[]): Promise<Character[]> {
    const characters = await this.request<CharacterName[]>({
      url: 'characters/names/',
      method: 'GET',
      params: {
        character_ids: ids.join(','),
      },
    });

    // Transform api response to Character
    return characters.map((characterName) => {
      const character = new Character();
      character.id = characterName.character_id;
      character.name = characterName.character_name;
      return character;
    });
  }

  /**
   * Get corporation names for ids
   * @param ids
   * @return {Promise<Corporation[]>}
   */
  public async corporationNames(ids: number[]): Promise<Corporation[]> {
    const corporations = await this.request<CorporationName[]>({
      url: 'corporations/names/',
      method: 'GET',
      params: {
        corporation_ids: ids.join(','),
      },
    });

    // Transform api response to Corporation
    return corporations.map((corporationName) => {
      const corporation = new Corporation();
      corporation.id = corporationName.corporation_id;
      corporation.name = corporationName.corporation_name;
      return corporation;
    });
  }

  /**
   * Get alliance names for ids
   * @param ids
   * @return {Promise<Alliance[]>}
   */
  public async allianceNames(ids: number[]): Promise<Alliance[]> {
    const alliances = await this.request<AllianceName[]>({
      url: 'alliances/names/',
      method: 'GET',
      params: {
        alliance_ids: ids.join(','),
      },
    });


    // Transform api response to Alliance
    return alliances.map((allianceName) => {
      const alliance = new Alliance();
      alliance.id = allianceName.alliance_id;
      alliance.name = allianceName.alliance_name;
      return alliance;
    });
  }

  /**
   * Get character by id
   * @param id
   * @return {Promise<GetCharacter>}
   */
  public async getCharacter(id: number): Promise<GetCharacter> {
    return this.request<GetCharacter>({
      url: `characters/${id}/`,
      method: 'GET',
    });
  }

}
