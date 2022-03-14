import { BaseService, BaseServiceMethod } from "../BaseService";
import { HOST_FACEBOOK } from "../HostPathApi";

class FacebookService extends BaseService {
  private headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  getApiPath = async () => {
    return HOST_FACEBOOK();
  }

  public getInfoPageOrUserById(id: string, access_token: string) {

    return this.fetch({
      path: id,
      method: BaseServiceMethod.GET,
      query: `&access_token=${access_token}&fields=name,picture,id`,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getDetailComment(comment_id: string, access_token: string) {
    const fields = ['can_hide', 'is_hidden', 'message', 'created_time', 'from', 'attachment', 'user_likes', 'like_count',
      'comments.summary(true).limit(5).order(reverse_chronological){can_hide,like_count,user_likes, is_hidden,created_time,from,message,attachment}'];
    const param = {
      access_token: access_token,
      fields: fields.join(','),
      order: 'reverse_chronological'
    };
    return this.fetch({
      path: comment_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getDetailPost(post_id: string, access_token: string) {
    const fields = ['id', 'from', 'message', 'attachments{type,media,url,media_type,title,description,target,subattachments}', 'likes.limit(0).summary(true)',
      'comments.limit(5).summary(true).order(reverse_chronological){can_hide,is_hidden,created_time,user_likes,like_count,from,message,attachment,comments.limit(0).summary(true)}',
      'status_type', 'created_time', 'full_picture', 'insights.period(lifetime).metric(post_video_views)'];
    const param = {
      access_token: access_token,
      fields: fields.join(',')
    };
    return this.fetch({
      path: post_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getNextUrl(url: string) {
    return this.fetch({
      path: url,
      method: BaseServiceMethod.GET,
      headers: this.headers,
      returnResponseServer: true
    }, true, true);
  }

  public deleteComment(comment_id: string, access_token: string) {
    return this.fetch({
      path: `${comment_id}?access_token=${access_token}`,
      method: BaseServiceMethod.DELETE,
      body: {},
      headers: this.headers,
      returnResponseServer: true
    }, true);
  }

  public updateComment(comment_id: string, access_token: string, body: any) {
    return this.fetch({
      path: `${comment_id}?access_token=${access_token}`,
      method: BaseServiceMethod.POST,
      body: body,
      headers: this.headers,
      returnResponseServer: true
    }, true);
  }
  
  public doLike(object_id: string, access_token: string, dislike: boolean) {
    if (dislike) {
      return this.fetch({
        path: `${object_id}/likes?access_token=${access_token}`,
        method: BaseServiceMethod.DELETE,
        headers: this.headers,
        returnResponseServer: true
      }, true);
    }
    return this.fetch({
      path: `${object_id}/likes?access_token=${access_token}`,
      method: BaseServiceMethod.POST,
      body: {},
      headers: this.headers,
      returnResponseServer: true
    }, true);
  }

  public changeDisplayComment(comments_id: string, access_token: string, is_hidden: boolean) {
    return this.fetch({
      path: `${comments_id}?access_token=${access_token}&is_hidden=${is_hidden}`,
      method: BaseServiceMethod.POST,
      body: {},
      headers: this.headers,
      returnResponseServer: true
    }, true);
  }

  // ===================INSTAGRAM==================

  public changeDisplayCommentInstagram(comments_id: string, access_token: string, is_hidden: boolean) {
    const body = new FormData();
    body.append('hide', is_hidden.toString());
    return this.fetch({
      path: `${comments_id}?access_token=${access_token}`,
      method: BaseServiceMethod.POST,
      body: body,
      headers: this.headers,
      returnResponseServer: true
    }, true);
  }

  public async getIconInstagram(page: any): Promise<string> {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const param = {
      access_token: page.token_auth,
      fields: 'profile_picture_url'
    };

    const result: any = await this.fetch({
      path: page.page_social_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: headers,
      returnResponseServer: true
    });

    return result.profile_picture_url || '';
  }

  public getDetailMediaInstagram(media_id: string, access_token: string) {
    const fields = ['id', 'username', 'caption', 'media_type', 'media_url', 'thumbnail_url', 'comments_count', 'like_count', 'timestamp', 'owner',
      'comments.limit(5){id,text,hidden,like_count,timestamp,username,replies.limit(5){text,id,hidden,timestamp,username,user,like_count}}', 'children{id,media_type,media_url}'];
    const param = {
      access_token: access_token,
      fields: fields.join(',')
    };
    return this.fetch({
      path: media_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getDetailCommentInstagram(comment_id: string, access_token: string) {
    const fields = ['id', 'text', 'hidden', 'like_count', 'timestamp', 'username', 'replies.limit(5){text,id,hidden,timestamp,username,user,like_count}'];
    const param = {
      access_token: access_token,
      fields: fields.join(','),
    };
    return this.fetch({
      path: comment_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getMediasInstagram(page_id: string, access_token: string, limit: number, next_token: string) {
    const fields = ['id', 'username', 'caption', 'media_type', 'media_url', 'thumbnail_url', 'comments_count', 'like_count', 'timestamp', 'permalink', 'children{id,media_type,media_url,thumbnail_url}',
      'comments.limit(5){id,text,hidden,like_count,timestamp,username,user,replies.limit(5){text,id,hidden,timestamp,username,user,like_count}}'];
    const param = {
      access_token: access_token,
      limit: limit,
      fields: fields.join(','),
      after: next_token
    };
    return this.fetch({
      path: `${page_id}/media`,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

  public getDetailSubCommentInstagram(comment_id: string, access_token: string) {
    const fields = ['id', 'text', 'hidden', 'like_count', 'timestamp', 'username', 'user'];
    const param = {
      access_token: access_token,
      fields: fields.join(','),
    };
    return this.fetch({
      path: comment_id,
      method: BaseServiceMethod.GET,
      query: param,
      headers: this.headers,
      returnResponseServer: true
    });
  }

}

export default new FacebookService();
